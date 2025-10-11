import { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { sessionDocument } from '../models/session.model.js';
import { userDocument } from '../models/user.model.js';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from '../constants/env.js';
import jwt from 'jsonwebtoken';

type accessTokenPayload = {
  userId: userDocument['_id'];
  sessionId: sessionDocument['_id'];
};

export type refreshTokenPayload = {
  sessionId: sessionDocument['_id'];
};

const defaultSignOpt: SignOptions = {
  audience: 'user',
};

type signOptionsAndSecret = SignOptions & {
  secret: string;
};

export const refreshTokenSignOptions: signOptionsAndSecret = {
  expiresIn: '30d',
  secret: JWT_REFRESH_TOKEN_SECRET,
};

const accessTokenSignOptions: signOptionsAndSecret = {
  expiresIn: '15m',
  secret: JWT_ACCESS_TOKEN_SECRET,
};

const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options?: signOptionsAndSecret
) => {
  const { secret, ...signOpt } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaultSignOpt,
    ...signOpt,
  });
};

type verifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};

const defaultVerifyOpt: VerifyOptions = {
  audience: 'user',
};

const verifyToken = <TPayload extends object = accessTokenPayload>(
  token: string,
  options?: verifyOptionsAndSecret
) => {
  try {
    const { secret, ...verifyOpt } = options || { secret: JWT_ACCESS_TOKEN_SECRET };

    const payload = jwt.verify(token, secret, {
      ...defaultVerifyOpt,
      ...verifyOpt,
    }) as TPayload;

    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export { signToken, verifyToken };
