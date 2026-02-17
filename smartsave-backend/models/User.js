const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  lang: {
    type: String,
    default: 'en'
  },
  availableBalance: {
    type: Number,
    default: 0
  },
  savingsBalance: {
    type: Number,
    default: 0
  },
  totalIncome: {
    type: Number,
    default: 0
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  budgetsByMonth: {
    type: Map,
    of: {
      budget: Number,
      spent: Number
    },
    default: {}
  },
  goal: {
    amount: { type: Number, default: 0 },
    deadline: Date,
    name: String,
    description: String,
    icon: String,
    emoji: String
  },
  catBudgets: {
    type: Map,
    of: Number,
    default: {}
  },
  streak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
