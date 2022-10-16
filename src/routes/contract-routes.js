import { Router } from 'express';
import { getProfile } from '../middleware/getProfile';
import { Op } from 'sequelize';

export const contractRouter = new Router();

contractRouter.get('/:id', getProfile, async (req, res) => {
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

contractRouter.get('/', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;

  const contracts = await Contract.model.getOngoingProcessByProfile(profileId);

  if (!contracts.length) return res.status(404).end();
  res.json(contracts);
});
