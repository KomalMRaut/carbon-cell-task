import userRouter from '@src/routes/v1/user.route';
import { Router } from 'express';

const router = Router();

router.use('/user', userRouter);

export default router;
