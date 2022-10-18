import { DEPOSIT_VALIDATION_TAX } from '../utils';
import { getContractByProfile } from './contractService';

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
  return depositAmount <= ownedAmount * DEPOSIT_VALIDATION_TAX;
};

export const getProfileByType = async ({ Profile, type }) => {
  const profiles = await Profile.findAll({
    where: { type },
    raw: true,
  });

  return profiles;
};

export const getTotalAmountByProfile = ({
  allProfiles,
  allContractsFromPaidJobs,
  allPaidJobs,
  type,
  groupingProperty,
}) => {
  return allProfiles.reduce((result, profile) => {
    const key = profile[groupingProperty];
    const { id } = profile;

    result[key] = result[key] || 0;

    const contractIdsByProfile = getContractByProfile({
      allContractsFromPaidJobs,
      profileId: id,
      type,
    });

    const paidJobsByClient = allPaidJobs.filter((job) =>
      contractIdsByProfile.includes(job.ContractId)
    );

    const amount = paidJobsByClient.reduce((total, cur) => {
      return total + cur.price;
    }, 0);

    result[key] = result[key] + amount;

    return result;
  }, {});
};

export const getBestClients = async ({ Profile, sortedClients, limit }) => {
  const trueLimit = Math.min(+limit, sortedClients.length);

  const clients = [];

  for (let i = 0; i < trueLimit; i++) {
    const clientId = sortedClients[i][0];

    const { firstName, lastName } = await getProfile({
      Profile,
      profileId: clientId,
    });

    const client = {
      id: clientId,
      fullName: `${firstName} ${lastName}`,
      paid: sortedClients[i][1],
    };
    clients.push(client);
  }
  return clients;
};
