const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const RecurringExpense = require('../models/RecurringExpense');
const { getMonthKey, toMonthlyAmount } = require('../utils/calculations');

// @route   GET /api/dashboard/metrics
// @desc    Get all dashboard metrics for user
// @access  Private
router.get('/metrics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const transactions = await Transaction.find({ userId: req.userId });
    const recurring = await RecurringExpense.find({ userId: req.userId });

    // Calculate monthly recurring total
    const monthlyRecurring = recurring.reduce((sum, r) => {
      return sum + toMonthlyAmount(r.amount, r.frequency);
    }, 0);

    // Get current month spent
    const monthKey = getMonthKey();
    const currentMonth = user.budgetsByMonth?.get(monthKey) || { budget: user.monthlyBudget, spent: 0 };

    res.json({
      available: user.availableBalance,
      savings: user.savingsBalance,
      budget: currentMonth.budget || user.monthlyBudget,
      spent: currentMonth.spent || 0,
      committed: monthlyRecurring,
      totalIncome: user.totalIncome,
      streak: user.streak
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;