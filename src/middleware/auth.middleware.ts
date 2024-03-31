import { Request, Response, NextFunction } from 'express';
import { validateToken } from '@src/services/auth.service';
import { BadRequestError, AuthFailureError } from '@src/utils/apiError';

const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): Response<unknown, Record<string, unknown>> | void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new BadRequestError(`Token is missing`);
  }

  const decoded: {
    isValid: boolean;
    message: string;
    data: any;
  } = validateToken(token) as {
    isValid: boolean;
    message: string;
    data: any;
  };
  if (!decoded.isValid) {
    throw new AuthFailureError(decoded.message);
  }

  req.body.decoded = decoded.data;
  return next();
};

export default authMiddleware;
