import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import { parseInsertableJobData } from './dtos';
import { JobService } from './service';

export const jobRouter = Router();

jobRouter.route('/').post(
  jsonRoute(async (req) => {
    const data = parseInsertableJobData(req.body);
    const newJob = await JobService.createJob(data);

    return newJob;
  }, StatusCodes.CREATED)
);
