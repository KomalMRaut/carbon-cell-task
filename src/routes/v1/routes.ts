import entriesRouter from '@src/routes/v1/entries.route';
import userRouter from '@src/routes/v1/user.route';
import { Router } from 'express';

const router = Router();

router.use('/user', userRouter);
router.use('/entries', entriesRouter);

export default router;
