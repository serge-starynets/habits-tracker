import type { Request, Response, NextFunction } from 'express';
import env from '../../env.ts';

export interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error codes
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
  }

  if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  }

  res.status(status).json({
    error: message,
    ...(env.APP_STAGE === 'dev' && {
      stack: err.stack,
      details: err.message,
    }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`) as CustomError;
  error.status = 404;
  next(error);
};
