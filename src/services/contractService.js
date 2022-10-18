import { Op } from 'sequelize';
import { getPaidJobsByTimeRange } from './jobService';
import {
  CONTRACT_STATUS,
  getKeyFromArrayOfObjects,
  MODEL_PROPERTIES,
  PROFILE_TYPES,
} from '../utils';

export const getContractByIdAndOwner = async ({
  Contract,
  contractId,
  profileId,
}) => {
  return Contract.findOne({
    where: {
      [Op.and]: [
        { id: contractId },
        {
          [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
        },
      ],
    },
  });
};

export const getContractById = async ({
  Contract,
  contractId,
  transaction,
}) => {
  return Contract.findOne(
    {
      where: { id: contractId },
    },
    { transaction }
  );
};

export const getContractByIds = async ({ Contract, contractIds }) => {
  return Contract.findAll({
    where: { id: contractIds },
    raw: true,
  });
};

export const getOpenContracts = async ({ Contract, profileId }) => {
  return Contract.findAll({
    where: {
      [Op.and]: [
        {
          status: { [Op.ne]: CONTRACT_STATUS.TERMINATED },
        },
        {
          [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
        },
      ],
    },
  });
};

export const getContractsByClient = async ({
  Contract,
  clientId,
  transaction,
}) => {
  return Contract.findAll({ where: { clientId } }, { transaction });
};

export const getContractsByContractor = async ({
  Contract,
  contractorId,
  transaction,
}) => {
  return Contract.findAll(
    { where: { contractorId }, raw: true },
    { transaction }
  );
};

export const getAllContractsFromPaidJobs = async ({
  Job,
  Contract,
  startDate,
  endDate,
}) => {
  const allPaidJobs = await getPaidJobsByTimeRange({ Job, startDate, endDate });
  const allPaidJobsContractIds = getKeyFromArrayOfObjects(
    allPaidJobs,
    MODEL_PROPERTIES.CONTRACT_ID
  );

  return [
    allPaidJobs,
    await getContractByIds({
      Contract,
      contractIds: allPaidJobsContractIds,
    }),
  ];
};

export const getContractByProfile = ({
  allContractsFromPaidJobs,
  profileId,
  type,
}) => {
  const idType =
    type === PROFILE_TYPES.CONTRACTOR
      ? MODEL_PROPERTIES.CONTRACTOR_ID
      : MODEL_PROPERTIES.CLIENT_ID;

  const contractsByProfile = allContractsFromPaidJobs.filter(
    (contract) => contract[idType] === profileId
  );
  return getKeyFromArrayOfObjects(contractsByProfile, MODEL_PROPERTIES.ID);
};
