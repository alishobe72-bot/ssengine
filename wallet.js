// SS ENGINE - WALLET SERVICE

const wallets = new Map();

function getWallet(userId) {
  const id = String(userId);

  if (!wallets.has(id)) {
    wallets.set(id, {
      userId: id,
      balance: 0,
      currency: "INR",
      transactions: []
    });
  }

  return wallets.get(id);
}

function getWalletBalance(userId) {
  return getWallet(userId).balance;
}

// केवल verified payment या अधिकृत refund
// के बाद backend से इसे कॉल करना होगा।
function addWalletTransaction(userId, amount, reference, type) {
  if (
    !userId ||
    !Number.isInteger(amount) ||
    amount <= 0 ||
    !reference ||
    !["payment", "refund"].includes(type)
  ) {
    throw new Error("Invalid wallet transaction");
  }

  const wallet = getWallet(userId);

  wallet.transactions.push({
    amount,
    reference,
    type,
    date: new Date().toISOString()
  });

  wallet.balance += amount;

  return wallet.balance;
}

function getWalletHistory(userId) {
  return getWallet(userId).transactions;
}

module.exports = {
  getWallet,
  getWalletBalance,
  addWalletTransaction,
  getWalletHistory
};
