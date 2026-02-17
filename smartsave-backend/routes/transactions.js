const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { getMonthKey } = require('../utils/calculations');

// @route   POST /api/transactions
// @desc    Add new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { merchant, amount, category, date, type } = req.body;

    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check balance for save transactions
    if (type === 'save' && amount > user.availableBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      merchant,
      amount,
      category: type === 'expense' ? category : null,
      date: date || new Date().toISOString().split('T')[0],
      type
    });

    await transaction.save();

    // Update user balances
    if (type === 'income') {
      user.availableBalance += amount;
      user.totalIncome += amount;
    } else if (type === 'expense') {
      user.availableBalance -= amount;
      
      // Update monthly budget tracking
      const monthKey = getMonthKey(transaction.date);
      if (!user.budgetsByMonth) {
        user.budgetsByMonth = new Map();
      }
      if (!user.budgetsByMonth.get(monthKey)) {
        user.budgetsByMonth.set(monthKey, {
          budget: user.monthlyBudget,
          spent: 0
        });
      }
      const monthData = user.budgetsByMonth.get(monthKey);
      monthData.spent += amount;
      user.budgetsByMonth.set(monthKey, monthData);
    } else if (type === 'save') {
      user.availableBalance -= amount;
      user.savingsBalance += amount;
    }

    // Update streak if first transaction of the day
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = await Transaction.find({
      userId: req.userId,
      date: today
    });
    if (todayTransactions.length === 1) {
      user.streak += 1;
    }

    await user.save();

    res.json({
      transaction,
      user: {
        availableBalance: user.availableBalance,
        savingsBalance: user.savingsBalance,
        totalIncome: user.totalIncome,
        streak: user.streak,
        budgetsByMonth: Object.fromEntries(user.budgetsByMonth)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 });
    
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const user = await User.findById(req.userId);

    // Reverse the transaction effects
    if (transaction.type === 'income') {
      user.availableBalance -= transaction.amount;
      user.totalIncome -= transaction.amount;
    } else if (transaction.type === 'expense') {
      user.availableBalance += transaction.amount;
      
      // Update monthly budget
      const monthKey = getMonthKey(transaction.date);
      if (user.budgetsByMonth && user.budgetsByMonth.get(monthKey)) {
        const monthData = user.budgetsByMonth.get(monthKey);
        monthData.spent -= transaction.amount;
        if (monthData.spent < 0) monthData.spent = 0;
        user.budgetsByMonth.set(monthKey, monthData);
      }
    } else if (transaction.type === 'save') {
      user.availableBalance += transaction.amount;
      user.savingsBalance -= transaction.amount;
    }

    await user.save();
    await transaction.deleteOne();

    res.json({
      message: 'Transaction deleted',
      user: {
        availableBalance: user.availableBalance,
        savingsBalance: user.savingsBalance,
        totalIncome: user.totalIncome,
        budgetsByMonth: Object.fromEntries(user.budgetsByMonth || new Map())
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
