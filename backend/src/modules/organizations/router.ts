import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import { OrganizationService } from './service';
import {
  parseOrganizationId,
  parseInsertableOrganizationData,
  parseUpdateableOrganizationData,
} from './dtos';

export const organizationRouter = Router();

organizationRouter.route('/').get(
  jsonRoute(async () => {
    const organizations = await OrganizationService.findAll();

    return organizations;
  }, StatusCodes.OK)
);

organizationRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseOrganizationId(req.params.id);
    const organization = await OrganizationService.findById(validId);

    return organization;
  }, StatusCodes.OK)
);

organizationRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableOrganizationData(req.body);
    const newOrganization = await OrganizationService.create(validData);

    return newOrganization;
  }, StatusCodes.CREATED)
);

organizationRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseOrganizationId(req.params.id);
    const validData = parseUpdateableOrganizationData(req.body);
    const updatedOrganization = await OrganizationService.update(
      validId,
      validData
    );

    return updatedOrganization;
  }, StatusCodes.OK)
);

organizationRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseOrganizationId(req.params.id);
    const deletedOrganization = await OrganizationService.delete(validId);

    return deletedOrganization;
  }, StatusCodes.OK)
);

// domain-specific routes? e.g. "/:id/addUser"
