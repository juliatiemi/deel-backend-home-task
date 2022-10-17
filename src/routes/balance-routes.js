import { Router } from 'express';
import { getProfile } from '../middleware/getProfile';
import { makeDeposit } from '../controllers/balanceController';

export const balanceRouter = new Router();

balanceRouter.post('/deposit/:userId', getProfile, makeDeposit);
