import { Router } from 'express';
import { getProfile } from '../middleware/getProfile';
import {} from '../controllers/';
import { getBestProfession } from '../controllers/adminController';

export const adminRouter = new Router();

adminRouter.get('/best-profession', getProfile, getBestProfession);
