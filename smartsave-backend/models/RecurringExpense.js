const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

recurringExpenseSchema.index({ userId: 1 });

module.exports = mongoose.model('RecurringExpense', recurringExpenseSchema);
