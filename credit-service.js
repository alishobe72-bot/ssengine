// SS ENGINE - CREDIT SERVICE

const creditBalances = new Map();
const creditHistory = new Map();

function getBalance(userId) {
  return creditBalances.get(String(userId)) || 0;
}

function addCredits(userId, amount, reason = "Recharge") {
  if (!userId || !Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid credit transaction");
  }

  const id = String(userId);
  const balance = getBalance(id) + amount;

  creditBalances.set(id, balance);

  const history = creditHistory.get(id) || [];

  history.push({
    type: "credit",
    amount,
    reason,
    date: new Date().toISOString()
  });

  creditHistory.set(id, history);

  return balance;
}

function deductCredits(userId, amount, reason = "AI Usage") {
  if (!userId || !Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid credit amount");
  }

  const id = String(userId);
  const balance = getBalance(id);

  if (balance < amount) {
    throw new Error("Insufficient AI credits");
  }

  const newBalance = balance - amount;
  creditBalances.set(id, newBalance);

  const history = creditHistory.get(id) || [];

  history.push({
    type: "debit",
    amount,
    reason,
    date: new Date().toISOString()
  });

  creditHistory.set(id, history);

  return newBalance;
}

function getCreditHistory(userId) {
  return creditHistory.get(String(userId)) || [];
}

module.exports = {
  getBalance,
  addCredits,
  deductCredits,
  getCreditHistory
};
