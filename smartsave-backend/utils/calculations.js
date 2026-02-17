// Helper function to get month key (e.g., "2025-01")
function getMonthKey(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Get current month's budget data
function getCurrentMonthBudget(budgetsByMonth, monthlyBudget) {
  const monthKey = getMonthKey();
  if (!budgetsByMonth.has(monthKey)) {
    budgetsByMonth.set(monthKey, {
      budget: monthlyBudget,
      spent: 0
    });
  }
  return budgetsByMonth.get(monthKey);
}

// Calculate monthly recurring total
function toMonthlyAmount(amount, frequency) {
  switch (frequency) {
    case 'weekly': return amount * 4.33;
    case 'monthly': return amount;
    case 'yearly': return amount / 12;
    default: return amount;
  }
}

module.exports = {
  getMonthKey,
  getCurrentMonthBudget,
  toMonthlyAmount
};
