import { getContractByIds } from '../services/contractService';
import { getPaidJobsByTimeRange } from '../services/jobService';
import {
  getContractors,
  getTotalAmountByProfession,
} from '../services/profileService';
import { getKeyFromArrayOfObjects, getGreatestValueFromObject } from '../utils';

export const getBestProfession = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end } = req.query;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const allPaidJobs = await getPaidJobsByTimeRange({ Job, startDate, endDate });
  const allPaidJobsContractIds = getKeyFromArrayOfObjects(
    allPaidJobs,
    'ContractId'
  );

  const allContractsFromPaidJobs = await getContractByIds({
    Contract,
    contractIds: allPaidJobsContractIds,
  });

  const allContractors = await getContractors({ Profile });

  const totalAmountByProfession = getTotalAmountByProfession({
    allContractors,
    allContractsFromPaidJobs,
    allPaidJobs,
  });

  const bestProfession = getGreatestValueFromObject(totalAmountByProfession);

  res.json({ bestProfession });
};
