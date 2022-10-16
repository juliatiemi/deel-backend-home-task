import { sequelize } from '../models';
import { getContractById, getOpenContracts } from '../services/contractService';
import {
  getJobById,
  getUnpaidJobs as getUnpaidJobs_,
  payJob as payJob_,
} from '../services/jobService';
import {
  credit,
  debit,
  getProfile,
  hasBalance,
} from '../services/profileService';
import { getIdFromArrayOfObjects } from '../utils';

export const getUnpaidJobs = async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const { id: profileId } = req.profile;

  const contracts = await getOpenContracts({ Contract, profileId });
  if (!contracts.length)
    return res
      .status(404)
      .json({ message: 'No open contracts found for this profile.' });

  const contractIds = getIdFromArrayOfObjects(contracts);

  const unpaidJobs = await getUnpaidJobs_({ Job, contractIds });
  if (!unpaidJobs.length)
    return res
      .status(404)
      .json({ message: 'No unpaid jobs found for this profile.' });

  res.json(unpaidJobs);
};

export const payJob = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { job_id: jobId } = req.params;
  const { id: profileId } = req.profile;

  try {
    await sequelize.transaction(async (transaction) => {
      const job = await getJobById({
        Job,
        jobId,
        transaction,
      });
      if (!job) throw new Error('No job found.');

      const { ContractId: contractId, paid, price } = job;

      if (paid) throw new Error('This job has already been paid.');

      const contract = await getContractById({
        Contract,
        contractId,
        transaction,
      });

      if (!contract) throw new Error('Could not find contract for this job.');

      const { ContractorId: contractorId, ClientId: clientId } = contract;
      if (clientId !== profileId) throw new Error('Unauthorized.');

      const profile = await getProfile({
        Profile,
        profileId: clientId,
        transaction,
      });
      if (!profile) throw new Error('Could not find client for this job.');

      const { balance: clientBalance } = profile;
      if (!hasBalance(clientBalance, price))
        throw new Error('Insufficient balance.');

      const promises = [
        credit({ Profile, profileId: contractorId, value: price, transaction }),
        debit({ Profile, profileId: clientId, value: price, transaction }),
        payJob_({ Job, jobId, transaction }),
      ];

      await Promise.all(promises).catch((error) => {
        throw new Error('Something went wrong, please try again later.');
      });
    });

    res.json('Operation successful.');
  } catch (error) {
    res.status(406).json({ message: error.toString() });
  }
};
