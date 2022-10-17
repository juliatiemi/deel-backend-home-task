import { sequelize } from '../models';
import { getContractsByClient } from '../services/contractService';
import { calculateOwnedAmount, getUnpaidJobs } from '../services/jobService';
import { credit, isDepositAmountValid } from '../services/profileService';
import { getKeyFromArrayOfObjects } from '../utils';

export const makeDeposit = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { userId: targetProfileId } = req.params;
  const { id: profileId } = req.profile;
  const { amount: depositAmount } = req.body;

  if (+targetProfileId !== profileId)
    return res.status(401).json({ message: 'Unauthorized.' });

  try {
    await sequelize.transaction(async (transaction) => {
      const contracts = await getContractsByClient({
        Contract,
        clientId: profileId,
        transaction,
      });

      contracts;

      if (!contracts.length)
        throw new Error(
          'You need to create a contract before making a deposit.'
        );

      const contractIds = getKeyFromArrayOfObjects(contracts, 'id');

      const jobs = await getUnpaidJobs({ Job, contractIds, transaction });
      if (!jobs.length)
        throw new Error('You need to have unpaid jobs to make a deposit.');

      const ownedAmount = calculateOwnedAmount(jobs);

      if (!isDepositAmountValid(depositAmount, ownedAmount))
        throw new Error(
          'Your deposit can not be more than 25% your total of jobs to pay.'
        );

      await credit({ Profile, profileId, value: depositAmount, transaction });

      res.json('Operation successful.');
    });
  } catch (error) {
    res.status(406).json({ message: error.toString() });
  }
};
