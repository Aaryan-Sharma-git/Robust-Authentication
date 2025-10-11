import appErrorCodes from '../constants/appErrorCode.js';
import { httpsStatusCode } from '../constants/http.js';
import assert from 'assert';
import AppError from './appError.js';

type appAssert = (
  condition: any,
  httpStatusCode: httpsStatusCode,
  message: string,
  errorCode?: appErrorCodes
) => asserts condition;

const appAssert: appAssert = (condition, httpStatusCode, message, errorCode) => {
  assert(condition, new AppError(httpStatusCode, message, errorCode));
};

export default appAssert;
