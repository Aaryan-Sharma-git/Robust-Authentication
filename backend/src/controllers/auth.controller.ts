import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from '../constants/http.js';
import {
  createAccount,
  forgotPassword,
  loginUser,
  refreshAccessToken,
  resetPassword,
  verifyEmail,
} from '../services/auth.service.js';
import {
  clearCookies,
  getAccessTokenOptions,
  getRefreshTokenOptions,
  setAuthCookies,
} from '../utils/setAuthCookies.js';
import {
  emailSchema,
  loginSchema,
  passwordSchema,
  registrationSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from './auth.schema.js';
import { verifyToken } from '../utils/jwt.js';
import SessionModel from '../models/session.model.js';
import appAssert from '../utils/appAssert.js';

const handleRegistration = async (req: Request, res: Response, next: NextFunction) => {
  // validating request
  const result = registrationSchema.safeParse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  if (!result.success) {
    next(result.error);
    return;
  }

  // create user
  const { user, accessToken, refreshToken } = await createAccount({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.headers['user-agent'],
  });

  // return
  setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user);
  return;
};

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const result = loginSchema.safeParse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  if (!result.success) {
    next(result.error);
    return;
  }

  // login service
  const { user, accessToken, refreshToken } = await loginUser({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.headers['user-agent'],
  });

  // return
  setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: 'login successful.',
  });

  return;
};

const handleLogout = async (req: Request, res: Response) => {
  const accessToken = req.cookies.Access_Token;

  const { payload } = verifyToken(accessToken);

  appAssert(payload, BAD_REQUEST, 'payload cannot be generated.');

  await SessionModel.findByIdAndDelete(payload.sessionId);

  clearCookies(res).status(OK).json({
    message: 'logout successful!',
  });
  return;
};

const handleRefresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.Refresh_Token;
  appAssert(refreshToken, UNAUTHORIZED, 'refresh token is not available.');

  const { newAccessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie('Refresh_Token', newRefreshToken, getRefreshTokenOptions());
  }

  res.cookie('Access_Token', newAccessToken, getAccessTokenOptions()).status(OK).json({
    message: 'access token refreshed',
  });
  return;
};

const handleEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  const verificationCode = req.params.code;

  const result = verificationCodeSchema.safeParse(verificationCode);

  if (!result.success) {
    next(result.error);
    return;
  }

  const { user } = await verifyEmail(verificationCode);

  res.status(OK).json({
    user,
    message: 'email verified successfully!',
  });
  return;
};

const handleForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const result = emailSchema.safeParse(req.body.email);

  if (!result.success) {
    next(result.error);
    return;
  }

  const { emailId, url } = await forgotPassword(req.body.email);

  res.status(OK).json({
    message: 'password reset email sent successfully.',
  });
  return;
};

const handleResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const result = resetPasswordSchema.safeParse(body);
  if (!result.success) {
    next(result.error);
    return;
  }

  await resetPassword(body.verificationCode, body.password);

  clearCookies(res).status(OK).json({
    message: 'password reset successful.',
  });

  return;
};

export {
  handleRegistration,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleEmailVerification,
  handleForgotPassword,
  handleResetPassword,
};
