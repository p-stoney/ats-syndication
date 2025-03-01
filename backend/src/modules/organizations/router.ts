import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import { OrgService } from './service';
import {
  parseOrgId,
  parseInsertableOrgData,
  parseUpdateableOrgData,
} from './dtos';
import { parseUserId } from '../users/dtos';

export const orgRouter = Router();

orgRouter.route('/').get(
  jsonRoute(async () => {
    const orgs = await OrgService.findAll();

    return orgs;
  }, StatusCodes.OK)
);

orgRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseOrgId(req.params.id);
    const org = await OrgService.findById(validId);

    return org;
  }, StatusCodes.OK)
);

orgRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableOrgData(req.body);
    const newOrg = await OrgService.create(validData);

    return newOrg;
  }, StatusCodes.CREATED)
);

orgRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseOrgId(req.params.id);
    const validData = parseUpdateableOrgData(req.body);
    const updatedOrg = await OrgService.update(validId, validData);

    return updatedOrg;
  }, StatusCodes.OK)
);

orgRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseOrgId(req.params.id);
    const deletedOrg = await OrgService.delete(validId);

    return deletedOrg;
  }, StatusCodes.OK)
);

orgRouter.route('/:id/members').get(
  jsonRoute(async (req) => {
    const validOrgId = parseOrgId(req.params.orgId);
    const members = await OrgService.listMembers(validOrgId);

    return members;
  }, StatusCodes.OK)
);

orgRouter.route('/:id/members').post(
  jsonRoute(async (req) => {
    const validOrgId = parseOrgId(req.params.orgId);
    const validUserId = parseUserId(req.body.userId);
    const newMember = await OrgService.addMember(validOrgId, validUserId);

    return newMember;
  }, StatusCodes.CREATED)
);

orgRouter.route('/:id/members/:userId').delete(
  jsonRoute(async (req) => {
    const validOrgId = parseOrgId(req.params.orgId);
    const validUserId = parseUserId(req.params.userId);
    const deletedMember = OrgService.removeMember(validOrgId, validUserId);

    return deletedMember;
  }, StatusCodes.OK)
);
