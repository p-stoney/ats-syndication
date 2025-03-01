import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseApplicationId,
  parseInsertableApplication,
  parseUpdateableApplication,
  parseAppSearchQuery,
} from './dtos';
import { AppsService } from './service';

export const appsRouter = Router();

appsRouter.route('/').get(
  jsonRoute(async (req) => {
    const apps = await AppsService.findAll();

    return apps;
  }, StatusCodes.OK)
);

appsRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const app = await AppsService.findById(validId);

    return app;
  }, StatusCodes.OK)
);

appsRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableApplication(req.body);
    const newApp = await AppsService.create(validData);

    return newApp;
  }, StatusCodes.CREATED)
);

appsRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const validData = parseUpdateableApplication(req.body);
    const updatedApp = await AppsService.update(validId, validData);

    return updatedApp;
  }, StatusCodes.OK)
);

appsRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const deletedApp = await AppsService.delete(validId);

    return deletedApp;
  }, StatusCodes.OK)
);

appsRouter.route('/:id/review').patch(
  jsonRoute(async (req) => {
    const validId = parseApplicationId(req.params.id);
    const newStatus = req.body.status;
    const reviewedApp = await AppsService.reviewApplication(validId, newStatus);

    return reviewedApp;
  }, StatusCodes.OK)
);

appsRouter.get(
  '/search',
  jsonRoute(async (req) => {
    const filters = parseAppSearchQuery(req.query);
    const results = await AppsService.searchApplications(filters);

    return results;
  }, StatusCodes.OK)
);
