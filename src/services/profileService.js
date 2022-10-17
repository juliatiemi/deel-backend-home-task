import { getKeyFromArrayOfObjects } from '../utils';

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

export const getContractors = async ({ Profile }) => {
  const professions = await Profile.findAll({
    where: { type: 'contractor' },
    raw: true,
  });

  return professions;
};

export const getTotalAmountByProfession = ({
  allContractors,
  allContractsFromPaidJobs,
  allPaidJobs,
}) => {
  return allContractors.reduce((result, contractor) => {
    const { profession: key, id } = contractor;

    result[key] = result[key] || 0;

    const contractsByAContractor = allContractsFromPaidJobs.filter(
      (contract) => contract.ContractorId === id
    );
    const contractIdsByAContractor = getKeyFromArrayOfObjects(
      contractsByAContractor,
      'id'
    );

    const paidJobsByContractor = allPaidJobs.filter((job) =>
      contractIdsByAContractor.includes(job.ContractId)
    );

    const amount = paidJobsByContractor.reduce((total, cur) => {
      return total + cur.price;
    }, 0);

    result[key] = result[key] + amount;

    return result;
  }, {});
};
