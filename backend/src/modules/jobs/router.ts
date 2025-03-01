import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseJobId,
  parseInsertableJob,
  parseUpdateableJob,
  parseUpdateableSynd,
  parseJobSearchQuery,
} from './dtos';
import { parseOrgId } from '../organizations/dtos';
import { parsePlatformId } from '../platforms/dtos';
import { JobService } from './service';

export const jobRouter = Router();

jobRouter.route('/').get(
  jsonRoute(async (req) => {
    const jobs = await JobService.findAll();

    return jobs;
  }, StatusCodes.OK)
);

jobRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const job = await JobService.findById(validId);

    return job;
  }, StatusCodes.OK)
);

jobRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableJob(req.body);
    const newJob = await JobService.create(validData);

    return newJob;
  }, StatusCodes.CREATED)
);

jobRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const validData = parseUpdateableJob(req.body);
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

jobRouter.route('/:id/publish').patch(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const updatedJob = await JobService.publishJob(validId);

    return updatedJob;
  }, StatusCodes.OK)
);

jobRouter.route('/:id/close').patch(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.id);
    const updatedJob = await JobService.closeJob(validId);

    return updatedJob;
  }, StatusCodes.OK)
);

jobRouter.route('/:id/assign-org').patch(
  jsonRoute(async (req) => {
    const validJobId = parseJobId(req.params.id);
    const validOrgId = parseOrgId(req.body.orgId);
    const updated = await JobService.assignOrg(validJobId, validOrgId);

    return updated;
  }, StatusCodes.OK)
);

jobRouter.route('/:jobId/syndications').get(
  jsonRoute(async (req) => {
    const validId = parseJobId(req.params.jobId);
    const syns = await JobService.listSyndications(validId);

    return syns;
  }, StatusCodes.OK)
);

jobRouter.route('/:jobId/syndications').post(
  jsonRoute(async (req) => {
    const validJobId = parseJobId(req.params.jobId);
    const validPlatformId = parsePlatformId(req.body.platformId);
    const newSyn = await JobService.addSyndication(validJobId, validPlatformId);

    return newSyn;
  }, StatusCodes.CREATED)
);

jobRouter.route('/:jobId/syndications/:platformId').patch(
  jsonRoute(async (req) => {
    const validJobId = parseJobId(req.params.jobId);
    const validPlatformId = parsePlatformId(req.params.platformId);
    const updates = parseUpdateableSynd(req.body);
    const updatedSyn = await JobService.updateSyndication(
      validJobId,
      validPlatformId,
      updates
    );

    return updatedSyn;
  }, StatusCodes.OK)
);

jobRouter.route('/:jobId/syndications/:platformId').delete(
  jsonRoute(async (req) => {
    const validJobId = parseJobId(req.params.jobId);
    const validPlatformId = parsePlatformId(req.params.platformId);
    const deletedSyn = await JobService.removeSyndication(
      validJobId,
      validPlatformId
    );

    return deletedSyn;
  }, StatusCodes.OK)
);

jobRouter.get(
  '/search',
  jsonRoute(async (req) => {
    const filters = parseJobSearchQuery(req.query);
    const results = await JobService.searchJobs(filters);

    return results;
  }, StatusCodes.OK)
);
