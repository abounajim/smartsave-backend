const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RecurringExpense = require('../models/RecurringExpense');

// @route   POST /api/recurring
// @desc    Add recurring expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, amount, frequency, category, startDate, endDate } = req.body;

    const recurring = new RecurringExpense({
      userId: req.userId,
      name,
      amount,
      frequency,
      category,
      startDate,
      endDate
    });

    await recurring.save();
    res.json(recurring);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/recurring
// @desc    Get all recurring expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const recurring = await RecurringExpense.find({ userId: req.userId });
    res.json(recurring);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/recurring/:id
// @desc    Delete recurring expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const recurring = await RecurringExpense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!recurring) {
      return res.status(404).json({ error: 'Recurring expense not found' });
    }

    await recurring.deleteOne();
    res.json({ message: 'Recurring expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
