import { Op } from 'sequelize';
import { getKeyFromArrayOfObjects, MODEL_PROPERTIES } from '../utils';

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
  return getKeyFromArrayOfObjects(jobs, MODEL_PROPERTIES.PRICE).reduce(
    (total, value) => total + value,
    0
  );
};

export const getPaidJobsByTimeRange = async ({ Job, startDate, endDate }) => {
  return await Job.findAll({
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    raw: true,
  });
};
