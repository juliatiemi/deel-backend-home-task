import { Op } from 'sequelize';
import { getKeyFromArrayOfObjects } from '../utils';

export const getUnpaidJobs = async ({ Job, contractIds, transaction }) => {
  return Job.findAll(
    {
      where: {
        [Op.and]: [
          {
            contractId: { [Op.in]: contractIds },
          },
          {
            paid: { [Op.not]: true },
          },
        ],
      },
    },
    { transaction }
  );
};

export const getJobById = async ({ Job, jobId, transaction }) => {
  return Job.findOne({ where: { id: jobId } }, { transaction });
};

export const payJob = async ({ Job, jobId, transaction }) => {
  return Job.update(
    { paymentDate: new Date(), paid: true },
    { where: { id: jobId } },
    { transaction }
  );
};

export const calculateOwnedAmount = (jobs) => {
  return getKeyFromArrayOfObjects(jobs, 'price').reduce(
    (value, total) => total + value,
    0
  );
};
