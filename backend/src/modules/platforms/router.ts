import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parsePlatformId,
  parseInsertablePlatformData,
  parseUpdateablePlatformData,
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
    const validData = parseInsertablePlatformData(req.body);
    const newPlatform = await PlatformService.create(validData);

    return newPlatform;
  }, StatusCodes.CREATED)
);

platformRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parsePlatformId(req.params.id);
    const validData = parseUpdateablePlatformData(req.body);
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

// platformRouter.route('/:id/ping').post(
//   jsonRoute(async (req) => {
//     const validId = parsePlatformId(req.params.id);
//     return PlatformService.pingPlatform(validId);
//   }, StatusCodes.OK)
// );
