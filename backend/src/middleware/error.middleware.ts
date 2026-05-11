import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  const error = env.NODE_ENV === 'development' ? err : null;

  res.status(statusCode).json(errorResponse(message, error));
};
