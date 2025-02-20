import { StatusCodes } from 'http-status-codes';

export interface IHttpError extends Error {
  status?: number;
}

export class HttpError extends Error implements IHttpError {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequest extends HttpError {
  constructor(message = 'Bad request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class MethodNotAllowed extends HttpError {
  constructor(message = 'Method not allowed') {
    super(StatusCodes.METHOD_NOT_ALLOWED, message);
  }
}

export class NotFound extends HttpError {
  constructor(message = 'Resource not found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class Conflict extends HttpError {
  constructor(message = 'Conflict occurred') {
    super(StatusCodes.CONFLICT, message);
  }
}
