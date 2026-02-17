const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getMonthKey, getCurrentMonthBudget } = require('../utils/calculations');

// @route   POST /api/budget
// @desc    Set monthly budget
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid budget amount' });
    }

    const user = await User.findById(req.userId);
    user.monthlyBudget = amount;

    // Set budget for current month
    const monthKey = getMonthKey();
    if (!user.budgetsByMonth) {
      user.budgetsByMonth = new Map();
    }
    const currentMonth = user.budgetsByMonth.get(monthKey) || { spent: 0 };
    currentMonth.budget = amount;
    user.budgetsByMonth.set(monthKey, currentMonth);

    await user.save();

    res.json({
      monthlyBudget: user.monthlyBudget,
      budgetsByMonth: Object.fromEntries(user.budgetsByMonth)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/budget
// @desc    Get budget info
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    res.json({
      monthlyBudget: user.monthlyBudget,
      budgetsByMonth: Object.fromEntries(user.budgetsByMonth || new Map())
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/budget/category
// @desc    Set category budget
// @access  Private
router.post('/category', auth, async (req, res) => {
  try {
    const { category, amount } = req.body;

    const user = await User.findById(req.userId);
    if (!user.catBudgets) {
      user.catBudgets = new Map();
    }
    user.catBudgets.set(category, amount);
    await user.save();

    res.json({
      catBudgets: Object.fromEntries(user.catBudgets)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
