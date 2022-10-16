import { Router } from 'express';
import { getProfile } from '../middleware/getProfile';
import { getUnpaidJobs, payJob } from '../controllers/jobController';

export const jobRouter = new Router();

jobRouter.get('/unpaid', getProfile, getUnpaidJobs);

jobRouter.post('/:job_id/pay', getProfile, payJob);
