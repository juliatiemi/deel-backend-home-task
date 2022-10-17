import { getContractByIds } from '../services/contractService';
import { getPaidJobsByTimeRange } from '../services/jobService';
import { getContractors } from '../services/profileService';
import { getKeyFromArrayOfObjects } from '../utils';

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

  console.log(allContractsFromPaidJobs);

  const allContractors = await getContractors({ Profile });

  const professionSum = allContractors.reduce((result, contractor) => {
    const { profession: key, id } = contractor;

    result[key] = result[key] || 0;

    const contractsByAContractor = allContractsFromPaidJobs.filter(
      (contract) => contract.ContractorId === id
    );
    const contractIdsByAContractor = getKeyFromArrayOfObjects(
      contractsByAContractor,
      'id'
    );

    const paidJobsByContractor = allPaidJobs.filter((job) =>
      contractIdsByAContractor.includes(job.ContractId)
    );

    const amount = paidJobsByContractor.reduce((total, cur) => {
      return total + cur.price;
    }, 0);

    result[key] = result[key] + amount;

    return result;
  }, {});

  const answer = Object.keys(professionSum).reduce((a, b) =>
    professionSum[a] > professionSum[b] ? a : b
  );

  res.json({ profession: answer });
};
