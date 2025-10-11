import { Request, Response } from 'express';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';
import { NOT_FOUND, OK } from '../constants/http.js';
import { email } from 'zod/v4';

const handleGetUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'user does not exist');

  res.status(OK).json({
    _id: user._id,
    email: user.email,
    createdAt: user.createdAt,
    verified: user.verified
  });
  return;
};

export { handleGetUser };
