import { Op } from 'sequelize';

export const getUnpaidJobs = async ({ Job, contractIds }) => {
  return Job.findAll({
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
  });
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
