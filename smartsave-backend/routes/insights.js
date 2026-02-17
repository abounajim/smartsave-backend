const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const RecurringExpense = require('../models/RecurringExpense');
const { generateInsights } = require('../utils/ai');

// @route   GET /api/insights
// @desc    Get AI insights for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const transactions = await Transaction.find({ userId: req.userId });
    const recurring = await RecurringExpense.find({ userId: req.userId });

    const insights = generateInsights(user, transactions, recurring);

    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
