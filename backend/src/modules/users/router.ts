import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { jsonRoute } from '../../middleware/jsonRoute';
import {
  parseUserId,
  parseInsertableUserData,
  parseUpdateableUserData,
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
    const validData = parseInsertableUserData(req.body);
    const newUser = await UserService.create(validData);

    return newUser;
  }, StatusCodes.CREATED)
);

userRouter.route('/:id').patch(
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);
    const validData = parseUpdateableUserData(req.body);
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

userRouter.route('/:id/promote').patch(
  jsonRoute(async (req) => {
    const validId = parseUserId(req.params.id);

    return UserService.promoteToEmployer(validId);
  }, StatusCodes.OK)
);
