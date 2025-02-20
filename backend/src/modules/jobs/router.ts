import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseJobId,
  parseInsertableJobData,
  parseUpdateableJobData,
} from './dtos';
import { JobService } from './service';

export const jobRouter = Router();

jobRouter.route('/').get(
  jsonRoute(async (req) => {
    const jobs = await JobService.findAll();
    return jobs;
  })
);

jobRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const job = await JobService.findById(validId);
    return job;
  })
);

jobRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableJobData(req.body);
    const newJob = await JobService.create(validData);

    return newJob;
  }, StatusCodes.CREATED)
);

jobRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const validData = parseUpdateableJobData(req.body);
    const updatedJob = await JobService.update(validId, validData);

    return updatedJob;
  }, StatusCodes.OK)
);

jobRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const deletedJob = await JobService.delete(validId);

    return deletedJob;
  }, StatusCodes.OK)
);
