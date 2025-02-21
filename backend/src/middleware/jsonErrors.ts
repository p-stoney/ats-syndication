import {
  type ErrorRequestHandler,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { HttpError } from '../utils/errors/http-error';

const { NODE_ENV } = process.env;
const isTest = NODE_ENV === 'test';

export const jsonErrors: ErrorRequestHandler = (
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = getErrorStatusCode(error);

  if (!isTest) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      ...error,
    },
  });
};

function getErrorStatusCode(error: Error) {
  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if (error instanceof ZodError) return StatusCodes.BAD_REQUEST;

  return StatusCodes.INTERNAL_SERVER_ERROR;
}

export default jsonErrors;
