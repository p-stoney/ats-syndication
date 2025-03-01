import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseApplicationId,
  parseInsertableApplicationData,
  parseUpdateableApplicationData,
} from './dtos';
import { AppsService } from './service';

export const appsRouter = Router();

appsRouter.route('/').get(
  jsonRoute(async (req) => {
    const applications = await AppsService.findAll();

    return applications;
  }, StatusCodes.OK)
);

appsRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const application = await AppsService.findById(validId);

    return application;
  }, StatusCodes.OK)
);

appsRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableApplicationData(req.body);
    const newApplication = await AppsService.create(validData);

    return newApplication;
  }, StatusCodes.CREATED)
);

appsRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const validData = parseUpdateableApplicationData(req.body);
    const updatedApplication = await AppsService.update(validId, validData);

    return updatedApplication;
  }, StatusCodes.OK)
);

appsRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const deletedApplication = await AppsService.delete(validId);

    return deletedApplication;
  }, StatusCodes.OK)
);
