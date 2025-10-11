import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';
import appAssert from '../utils/appAssert.js';
import { UNAUTHORIZED } from '../constants/http.js';
import UserModel from '../models/user.model.js';
import appErrorCodes from '../constants/appErrorCode.js';
import mongoose from 'mongoose';

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.Access_Token;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'access token is missing.',
    appErrorCodes.invalidAccessToken
  );

  const { payload, error } = verifyToken(req.cookies.Access_Token);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === 'jwt expired' ? 'access token expired.' : 'invalid access token.',
    appErrorCodes.invalidAccessToken
  );

  req.userId = payload.userId as mongoose.Types.ObjectId
  req.sessionId = payload.sessionId as mongoose.Types.ObjectId;
  next();
};

export default authHandler;
