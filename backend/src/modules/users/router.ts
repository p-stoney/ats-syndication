import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseUserId,
  parseInsertableUser,
  parseUpdateableUser,
  parseUserSearchQuery,
} from './dtos';
import { UserService } from './service';

export const userRouter = Router();

userRouter.route('/').get(
  jsonRoute(async (req) => {
    const users = await UserService.findAll();

    return users;
  }, StatusCodes.OK)
);

userRouter.route('/:id').get(
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);
    const user = await UserService.findById(validId);

    return user;
  }, StatusCodes.OK)
);

userRouter.route('/').post(
  jsonRoute(async (req) => {
    const validData = parseInsertableUser(req.body);
    const newUser = await UserService.create(validData);

    return newUser;
  }, StatusCodes.CREATED)
);

userRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);
    const validData = parseUpdateableUser(req.body);
    const updatedUser = await UserService.update(validId, validData);

    return updatedUser;
  }, StatusCodes.OK)
);

userRouter.route('/:id').delete(
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);
    const deletedUser = await UserService.delete(validId);

    return deletedUser;
  }, StatusCodes.OK)
);

userRouter.post(
  '/:id/setRole',
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);
    const newRole = req.body.role;
    const updatedUser = await UserService.setRole(validId, newRole);

    return updatedUser;
  }, StatusCodes.OK)
);

userRouter.get(
  '/search',
  jsonRoute(async (req) => {
    const filters = parseUserSearchQuery(req.query);
    const results = await UserService.searchUsers(filters);

    return results;
  }, StatusCodes.OK)
);
