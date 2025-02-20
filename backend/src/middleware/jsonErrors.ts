import { type ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { HttpError } from '../utils/errors/http-error';

const { NODE_ENV } = process.env;
const isTest = NODE_ENV === 'test';

export const jsonErrors: ErrorRequestHandler = (
  error: HttpError,
  _req,
  res,
  _next
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
