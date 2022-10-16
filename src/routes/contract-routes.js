import { Router } from 'express';
import { getProfile } from '../middleware/getProfile';
import {
  getContractById,
  getOpenContracts,
} from '../controllers/contractController';

export const contractRouter = new Router();

contractRouter.get('/:id', getProfile, getContractById);

contractRouter.get('/', getProfile, getOpenContracts);
