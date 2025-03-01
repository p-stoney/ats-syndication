import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parsePlatformId,
  parseInsertablePlatform,
  parseUpdateablePlatform,
  parsePlatformSearchQuery,
} from './dtos';
import { PlatformService } from './service';

export const platformRouter = Router();

platformRouter.route('/').get(
  jsonRoute(async () => {
    const platforms = await PlatformService.findAll();

    return platforms;
  }, StatusCodes.OK)
);

platformRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const platform = await PlatformService.findById(validId);

    return platform;
  }, StatusCodes.OK)
);

platformRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertablePlatform(req.body);
    const newPlatform = await PlatformService.create(validData);

    return newPlatform;
  }, StatusCodes.CREATED)
);

platformRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const validData = parseUpdateablePlatform(req.body);
    const updatedPlatform = await PlatformService.update(validId, validData);

    return updatedPlatform;
  }, StatusCodes.OK)
);

platformRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const deletedPlatform = await PlatformService.delete(validId);

    return deletedPlatform;
  }, StatusCodes.OK)
);

platformRouter.post(
  '/:id/ping',
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const result = await PlatformService.pingPlatform(validId);

    return result;
  }, StatusCodes.OK)
);

platformRouter.patch(
  '/:id/deactivate',
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const deactivated = await PlatformService.delete(validId);

    return deactivated;
  }, StatusCodes.OK)
);

platformRouter.get(
  '/search',
  jsonRoute(async (req) => {
    const filters = parsePlatformSearchQuery(req.query);
    const results = await PlatformService.searchPlatforms(filters);

    return results;
  }, StatusCodes.OK)
);
