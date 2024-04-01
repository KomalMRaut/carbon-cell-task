import {
  createUser,
  getEthBalance,
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

/**
 * @swagger
 * /v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User with this Email is already registered
 *       500:
 *         description: Failed to create user
 */
userRouter.post(
  '/register',
  validate({ body: registerUserSchema }),
  createUser,
);

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid login data
 *       401:
 *         description: Invalid password
 *       404:
 *         description: User with this email not found
 */
userRouter.post('/login', validate({ body: loginUserSchema }), loginUser);

/**
 * @swagger
 * /v1/user/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Logout a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.post('/logout', authMiddleware, logoutUser);

//* GET ROUTE

/**
 * @swagger
 * /v1/user/balance/{address}:
 *   get:
 *     tags:
 *       - User
 *     summary: Fetch the balance of an Ethereum account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: string
 *         required: true
 *         description: Ethereum account address
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *       400:
 *         description: Invalid address
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Error
 */
userRouter.get('/balance/:address', authMiddleware, getEthBalance);
export default userRouter;
