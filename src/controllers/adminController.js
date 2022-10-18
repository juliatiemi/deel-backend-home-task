import { getAllContractsFromPaidJobs } from '../services/contractService';
import {
  getProfileByType,
  getTotalAmountByProfile,
  getBestClients,
} from '../services/profileService';
import { sortObject, MODEL_PROPERTIES, PROFILE_TYPES } from '../utils';

export const getBestProfession = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const type = PROFILE_TYPES.CONTRACTOR;

  const [allPaidJobs, allContractsFromPaidJobs] =
    await getAllContractsFromPaidJobs({
      Job,
      Contract,
      startDate,
      endDate,
    });

  const allContractors = await getProfileByType({
    Profile,
    type,
  });

  const totalAmountByProfession = getTotalAmountByProfile({
    allProfiles: allContractors,
    allContractsFromPaidJobs,
    allPaidJobs,
    type,
    groupingProperty: MODEL_PROPERTIES.PROFESSION,
  });

  const sortedProfessions = sortObject(totalAmountByProfession);

  const bestProfession = sortedProfessions[0][0];

  res.json({ bestProfession });
};

export const getBestClient = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end, limit = 2 } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const type = PROFILE_TYPES.CLIENT;

  const [allPaidJobs, allContractsFromPaidJobs] =
    await getAllContractsFromPaidJobs({
      Job,
      Contract,
      startDate,
      endDate,
    });

  const allClients = await getProfileByType({
    Profile,
    type,
  });

  const totalAmountByClient = getTotalAmountByProfile({
    allProfiles: allClients,
    allContractsFromPaidJobs,
    allPaidJobs,
    type,
    groupingProperty: MODEL_PROPERTIES.ID,
  });

  const sortedClients = sortObject(totalAmountByClient);

  const bestClients = await getBestClients({ Profile, sortedClients, limit });

  res.json({ bestClients });
};
