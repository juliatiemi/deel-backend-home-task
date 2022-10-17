export const hasBalance = (clientBallance, amount) => {
  return clientBallance >= amount;
};

export const getProfile = async ({ Profile, profileId, transaction }) => {
  return Profile.findOne({ where: { id: profileId } }, { transaction });
};

export const credit = async ({ Profile, profileId, value, transaction }) => {
  return Profile.increment(
    { balance: value },
    { where: { id: profileId } },
    { transaction }
  );
};

export const debit = async ({ Profile, profileId, value, transaction }) => {
  return Profile.decrement(
    { balance: value },
    { where: { id: profileId } },
    { transaction }
  );
};

export const isDepositAmountValid = (depositAmount, ownedAmount) => {
  return depositAmount <= ownedAmount * 0.25;
};
