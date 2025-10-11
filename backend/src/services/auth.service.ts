import mongoose from 'mongoose';
import UserModel, { userDocument } from '../models/user.model.js';
import VerificationModel from '../models/verificationCode.model.js';
import verificationTypes from '../constants/verificationType.js';
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from '../utils/date.js';
import SessionModel from '../models/session.model.js';
import jwt from 'jsonwebtoken';
import {
  FRONTEND_URL,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../constants/env.js';
import appAssert from '../utils/appAssert.js';
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUEST,
  UNAUTHORIZED,
} from '../constants/http.js';
import {
  refreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from '../utils/jwt.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getPasswordResetTemplate, getVerifyEmailTemplate } from '../utils/emailTemplates.js';

type userDetail = {
  email: string;
  password: string;
  userAgent?: string;
};

type user = Pick<userDocument, '_id' | 'email' | 'verified' | 'createdAt' | 'updatedAt'>;

const createAccount = async (
  userInfo: userDetail
): Promise<{ user: user; accessToken: string; refreshToken: string }> => {
  // user exist
  const isExist = await UserModel.exists({ email: userInfo.email });

  appAssert(!isExist, CONFLICT, 'user already exists.');

  // create user account
  const user = await UserModel.create({
    email: userInfo.email,
    password: userInfo.password,
  });

  // verification code
  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: verificationTypes.emailVerification,
    expiresAt: oneYearFromNow(),
  });

  // send verification email
  const url = `${FRONTEND_URL}/email/verify/${verificationCode._id}`;
  const { data, error } = await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.log('email error', error);
  }

  // session creation
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: userInfo.userAgent,
  });

  // refresh token and access token creation
  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  // return
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password, userAgent }: userDetail) => {
  const user = await UserModel.findOne({ email: email });
  appAssert(user, NOT_FOUND, 'Invalid email or password');

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: userAgent,
  });

  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<refreshTokenPayload>(refreshToken, {
    secret: JWT_REFRESH_TOKEN_SECRET,
  });
  appAssert(payload, UNAUTHORIZED, 'payload is absent.');

  const session = await SessionModel.findById(payload.sessionId);
  appAssert(session, UNAUTHORIZED, 'session has expired.');

  const sessionNeedsRefresh: boolean = session.expiresAt.getTime() - Date.now() <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const newAccessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    newAccessToken,
    newRefreshToken,
  };
};

const verifyEmail = async (verificationCode: string) => {
  const verificationCodeDocument = await VerificationModel.findOne({
    _id: verificationCode,
    type: verificationTypes.emailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(verificationCodeDocument, INTERNAL_SERVER_ERROR, 'verification code has expired.');

  const updatedUser = await UserModel.findByIdAndUpdate(
    verificationCodeDocument.userId,
    {
      verified: true,
    },
    {
      new: true,
    }
  );
  appAssert(updatedUser, NOT_FOUND, 'user does not exist.');

  await verificationCodeDocument.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, "user dosen't exist.");

  const verificationCount = await VerificationModel.countDocuments({
    userId: user._id,
    type: verificationTypes.resetPassword,
    createdAt: { $gt: fiveMinutesAgo() },
  });
  appAssert(
    verificationCount <= 1,
    TOO_MANY_REQUEST,
    'requests has exceeded the limit. please try again later.'
  );

  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: verificationTypes.resetPassword,
    expiresAt: oneHourFromNow(),
  });

  const url = `${FRONTEND_URL}/password/reset?code=${verificationCode._id}&exp=${verificationCode.expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);

  return {
    emailId: data.id,
    url: url,
  };
};

const resetPassword = async (verificationCode: string, password: string) => {
  const verificationCodeDocument = await VerificationModel.findOne({
    _id: verificationCode,
    type: verificationTypes.resetPassword,
    expiresAt: { $gt: Date.now() },
  });
  appAssert(
    verificationCodeDocument,
    UNAUTHORIZED,
    'the verification code has expired. request password reset again.'
  );

  const user = await UserModel.findById(verificationCodeDocument.userId);
  appAssert(user, NOT_FOUND, "user dosen't exist.");

  user.password = password;
  await user.save();

  await verificationCodeDocument.deleteOne();

  await SessionModel.deleteMany({
    userId: user._id,
  });

  return {
    message: 'user password reset.',
  };
};

export { createAccount, loginUser, refreshAccessToken, verifyEmail, forgotPassword, resetPassword };
