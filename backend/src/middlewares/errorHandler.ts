import { ErrorRequestHandler, Response } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http.js';
import z from 'zod/v4';
import AppError from '../utils/appError.js';
import { clearCookies, REFRESH_TOKEN_PATH } from '../utils/setAuthCookies.js';

const handleZodError = (res: Response, error: z.ZodError) => {
  return res.status(BAD_REQUEST).json({
    message: 'validation error',
    error: error.issues,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.httpStatusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (req.path == REFRESH_TOKEN_PATH) {
    clearCookies(res);
  }

  if (error instanceof z.ZodError) {
    handleZodError(res, error);
    return;
  }

  if (error instanceof AppError) {
    handleAppError(res, error);
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send('Internal server error');
  return;
};

export default errorHandler;
