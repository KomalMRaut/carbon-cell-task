import {
  createUser,
  loginUser,
  logoutUser,
} from '@src/controller/user.controller';
import authMiddleware from '@src/middleware/auth.middleware';
import validate from '@src/middleware/validate.middleware';
import {
  loginUserSchema,
  registerUserSchema,
} from '@src/validation/user.validation';
import { Router } from 'express';

const userRouter: Router = Router();

//*POST ROUTE

userRouter.post(
  '/register',
  validate({ body: registerUserSchema }),
  createUser,
);

userRouter.post('/login', validate({ body: loginUserSchema }), loginUser);

userRouter.post('/logout', authMiddleware, logoutUser);

export default userRouter;
