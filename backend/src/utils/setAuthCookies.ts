import { Response, CookieOptions } from 'express';
import { NODE_ENV } from '../constants/env.js';
import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date.js';

type params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const REFRESH_TOKEN_PATH = '/auth/refresh';

const secure = NODE_ENV !== 'development';

const defaultOptions: CookieOptions = {
  httpOnly: true,
  secure: secure,
  sameSite: 'strict',
};

export const getAccessTokenOptions = () => {
  return {
    ...defaultOptions,
    expires: fifteenMinutesFromNow(),
  };
};

export const getRefreshTokenOptions = () => {
  return {
    ...defaultOptions,
    expires: thirtyDaysFromNow(),
    path: REFRESH_TOKEN_PATH,
  };
};

const setAuthCookies = ({ res, accessToken, refreshToken }: params) =>
  res
    .cookie('Access_Token', accessToken, getAccessTokenOptions())
    .cookie('Refresh_Token', refreshToken, getRefreshTokenOptions());

const clearCookies = (res: Response) => {
  return res.clearCookie('Access_Token').clearCookie('Refresh_Token', {
    path: REFRESH_TOKEN_PATH,
  });
};

export { setAuthCookies, clearCookies };
