const hasBalance = (clientBallance, amount) => {
  return clientBallance >= amount;
};

module.exports = {
  hasBalance,
};
