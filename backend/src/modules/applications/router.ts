import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseApplicationId,
  parseInsertableApplicationData,
  parseUpdateableApplicationData,
} from './dtos';
import { ApplicationService } from './service';

export const applicationRouter = Router();

applicationRouter.route('/').get(
  jsonRoute(async (req) => {
    const applications = await ApplicationService.findAll();

    return applications;
  }, StatusCodes.OK)
);

applicationRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const application = await ApplicationService.findById(validId);

    return application;
  }, StatusCodes.OK)
);

applicationRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableApplicationData(req.body);
    const newApplication = await ApplicationService.create(validData);

    return newApplication;
  }, StatusCodes.CREATED)
);

applicationRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const validData = parseUpdateableApplicationData(req.body);
    const updatedApplication = await ApplicationService.update(
      validId,
      validData
    );

    return updatedApplication;
  }, StatusCodes.OK)
);

applicationRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const deletedApplication = await ApplicationService.delete(validId);

    return deletedApplication;
  }, StatusCodes.OK)
);
