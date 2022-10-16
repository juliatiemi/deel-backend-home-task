import express, { json } from 'express';
import { sequelize } from './model';
import { getProfile } from './middleware/getProfile';
import { Op } from 'sequelize';
import { hasBalance } from './services/profileService';
import { contractRouter } from './routes';

const app = express();
app.use(json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

init();

async function init() {
  try {
    app.listen(3001, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

app.use('/contracts', contractRouter);

app.get('/jobs/unpaid', getProfile, async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const { id: profileId } = req.profile;

  const contracts = await Contract.model.getOngoingProcessByProfile(profileId);

  if (!contracts.length) return res.status(404).end();

  const contractIds = contracts.map((contract) => contract.id);

  const unpaidJobs = await Job.model.getUnpaidJobs(contractIds);
  if (!unpaidJobs.length) return res.status(404).end();
  res.json(unpaidJobs);
});

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { job_id: jobId } = req.params;
  const { id: profileId } = req.profile;

  //to do validate user

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const { ContractId, paid, price } = await Job.findOne(
        { where: { id: jobId } },
        { transaction }
      );

      console.log(
        `:>> Job ${jobId} costs ${price} and is it${paid ? '' : ' not'} paid.`
      );

      if (paid) throw new Error('This job has already been paid.');

      const { ContractorId, ClientId } = await Contract.findOne(
        { where: { id: ContractId }, raw: true },
        { transaction }
      );

      console.log(
        `:>> Contract ${ContractId} was between client ${ClientId} and contractor ${ContractorId}`
      );

      const { balance } = await Profile.findOne(
        { where: { id: ClientId } },
        { transaction }
      );

      console.log(`:>> Client has a ${balance} balance.`);

      if (!hasBalance(balance, price)) throw new Error('Insufficient balance.');

      const promises = [
        Profile.increment(
          { balance: price },
          { where: { id: ContractorId } },
          { transaction }
        ),
        Profile.decrement(
          { balance: price },
          { where: { id: ClientId } },
          { transaction }
        ),
        Job.update(
          { paymentDate: new Date(), paid: true },
          { where: { id: jobId } },
          { transaction }
        ),
      ];

      await Promise.all(promises).catch((_) => {
        throw new Error('Something went wrong try again later.');
      });

      const { balance: clientBalance } = await Profile.findOne(
        { where: { id: ClientId } },
        { transaction }
      );
      const { balance: contractorBalance } = await Profile.findOne(
        { where: { id: ContractorId } },
        { transaction }
      );

      console.log(
        `Client balace: ${clientBalance}\nContractor balance:${contractorBalance}`
      );
    });

    res.json('Operation success');
  } catch (error) {
    res.status(406).json({ message: error.toString() });
  }
});

export default app;
