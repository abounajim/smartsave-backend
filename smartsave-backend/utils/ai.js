const { getMonthKey, toMonthlyAmount } = require('./calculations');

// Generate AI insights based on user data
function generateInsights(user, transactions, recurringExpenses) {
  const insights = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  
  if (expenses.length < 3) {
    insights.push({
      type: 'info',
      icon: 'fa-info-circle',
      title: 'Pattern Detection Inactive',
      text: 'Add at least 3 transactions to activate AI spending analysis.'
    });
    return insights;
  }

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const avgExpense = totalExpenses / expenses.length;
  
  // Budget alert
  if (user.monthlyBudget > 0) {
    const monthKey = getMonthKey();
    const currentMonth = user.budgetsByMonth?.get(monthKey);
    const spent = currentMonth?.spent || 0;
    const pct = (spent / user.monthlyBudget) * 100;

    if (pct >= 100) {
      insights.push({
        type: 'warn',
        icon: 'fa-exclamation-triangle',
        title: 'Budget Breached',
        text: `You've overspent by $${(spent - user.monthlyBudget).toFixed(2)} this month.`,
        cta: 'Review your spending to get back on track.'
      });
    } else if (pct >= 80) {
      insights.push({
        type: 'caution',
        icon: 'fa-exclamation-circle',
        title: 'Budget at 80%',
        text: `$${spent.toFixed(2)} of $${user.monthlyBudget.toFixed(2)} used this month.`,
        cta: 'Consider pausing non-essential spending.'
      });
    }
  }

  // Unusual transaction detection
  expenses.forEach(expense => {
    if (expense.amount > avgExpense * 3) {
      insights.push({
        type: 'warn',
        icon: 'fa-bell',
        title: 'Unusual Transaction Detected',
        text: `$${expense.amount.toFixed(2)} on ${expense.merchant} — above average $${avgExpense.toFixed(2)}.`,
        cta: 'Review if this was expected.'
      });
    }
  });

  // Category spending patterns
  const categoryTotals = {};
  expenses.forEach(e => {
    if (e.category) {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    }
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const [cat, amount] = topCategory;
    const pct = ((amount / totalExpenses) * 100).toFixed(0);
    insights.push({
      type: 'info',
      icon: 'fa-chart-pie',
      title: `${cat} is ${pct}% of spending`,
      text: `You've spent $${amount.toFixed(2)} on ${cat}.`,
      cta: 'Consider if this aligns with your priorities.'
    });
  }

  // Recurring expense reminder
  if (recurringExpenses.length > 0) {
    const monthlyTotal = recurringExpenses.reduce((sum, r) => {
      return sum + toMonthlyAmount(r.amount, r.frequency);
    }, 0);

    insights.push({
      type: 'purple',
      icon: 'fa-sync-alt',
      title: 'Recurring Expenses',
      text: `$${monthlyTotal.toFixed(2)}/month committed to recurring payments.`,
      cta: 'Review if all subscriptions are still needed.'
    });
  }

  // Savings rate
  if (user.totalIncome > 0) {
    const savingsRate = (user.savingsBalance / user.totalIncome) * 100;
    if (savingsRate < 10) {
      insights.push({
        type: 'caution',
        icon: 'fa-piggy-bank',
        title: 'Low Savings Rate',
        text: `Only ${savingsRate.toFixed(1)}% of income saved.`,
        cta: 'Aim for at least 10-20% savings rate.'
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'good',
        icon: 'fa-trophy',
        title: 'Great Savings Rate!',
        text: `${savingsRate.toFixed(1)}% of income saved — excellent!`,
        cta: 'Keep up the good work!'
      });
    }
  }

  return insights.slice(0, 5); // Return top 5 insights
}

module.exports = { generateInsights };
