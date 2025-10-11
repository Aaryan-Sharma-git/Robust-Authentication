import appErrorCodes from '../constants/appErrorCode.js';
import { httpsStatusCode } from '../constants/http.js';

class AppError extends Error {
  constructor(
    public httpStatusCode: httpsStatusCode,
    public message: string,
    public errorCode?: appErrorCodes
  ) {
    super(message);
  }
}

export default AppError;
