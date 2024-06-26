import config from '@src/config/config';
import { UserModel } from '@src/model/user.model';
import { decrypt, encrypt, generateToken } from '@src/services/auth.service';
import {
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from '@src/utils/apiError';
import { SuccessMsgResponse, SuccessResponse } from '@src/utils/apiResponse';
import catchAsync from '@src/utils/catchAsync';
import Web3 from 'web3';

// User sign up
export const createUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email is already registered
  const existingUser = await UserModel.findOne({ email }).lean().exec();
  if (existingUser) {
    throw next(
      new BadRequestError('User with this Email is already registered'),
    );
  }

  // Hash password
  const hashedPassword = await encrypt(password);

  const user = await UserModel.create({
    email,
    password: hashedPassword,
  });

  if (!user) {
    throw next(new NotFoundError('Failed to create user'));
  }

  return new SuccessResponse('User registered successfully', user).send(res);
});

// User login
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email }).lean().exec();

  if (!user) {
    throw next(new NotFoundError(`User with ${email} not found`));
  }

  // Verify password
  const validPassword = await decrypt(password, user.password);

  if (!validPassword) {
    throw next(new AuthFailureError(`Invalid password`));
  }

  // Update user login status
  await UserModel.findByIdAndUpdate(user._id, { isLoggedIn: true });

  // Create and send JWT token
  const token = generateToken({ id: user._id });
  return new SuccessResponse('Logged in successfully', { token }).send(res);
});

export const logoutUser = catchAsync(async (req, res, _next) => {
  const { id } = req.body.decoded;

  // Update user login status
  const user = await UserModel.findById(id).lean().exec();
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.isLoggedIn) {
    throw new BadRequestError('User is already logged out');
  }

  await UserModel.findByIdAndUpdate(id, { isLoggedIn: false });

  return new SuccessMsgResponse('Logged out successfully').send(res);
});

// User Ethereum balance

export const getEthBalance = catchAsync(async (req, res, next) => {
  const web3 = new Web3(`https://mainnet.infura.io/v3/${config.infuraKey}`);
  const { address } = req.params;

  // Check if address is valid
  if (!web3.utils.isAddress(address)) {
    throw next(new BadRequestError('Invalid address'));
  }

  // Get the balance of the address
  const balanceWei = await web3.eth.getBalance(address);
  const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
  return new SuccessResponse('Balance retrieved successfully', {
    balance: balanceEther,
  }).send(res);
});
