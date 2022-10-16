const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { Op } = require('sequelize');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { id: profileId } = req.profile;
  const contract = await Contract.findOne({
    where: {
      [Op.and]: [
        { id },
        {
          [Op.or]: [{ contractorId: profileId }, { clientId: profileId }],
        },
      ],
    },
  });
  if (!contract) return res.status(404).end();
  res.json(contract);
});

app.get('/contracts', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;

  const contracts = await Contract.model.getOngoingProcessByProfile(profileId);

  if (!contracts.length) return res.status(404).end();
  res.json(contracts);
});

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

module.exports = app;
