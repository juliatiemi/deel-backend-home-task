import { Op } from 'sequelize';

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
          status: { [Op.ne]: 'terminated' },
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
