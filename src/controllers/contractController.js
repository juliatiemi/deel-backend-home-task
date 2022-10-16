import {
  getContractByIdAndOwner,
  getOpenContracts as getOpenContracts_,
} from '../services/contractService';

export const getContractById = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id: contractId } = req.params;
  const { id: profileId } = req.profile;

  const contract = await getContractByIdAndOwner({
    Contract,
    contractId,
    profileId,
  });

  if (!contract)
    return res
      .status(404)
      .json({ message: 'No contract found for this profile.' });
  res.json(contract);
};

export const getOpenContracts = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;

  const contracts = await getOpenContracts_({ Contract, profileId });

  if (!contracts.length)
    return res
      .status(404)
      .json({ message: 'No open contracts found for this profile.' });
  res.json(contracts);
};
