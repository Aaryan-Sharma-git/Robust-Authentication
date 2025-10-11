import express from 'express';
import {
  handleEmailVerification,
  handleForgotPassword,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegistration,
  handleResetPassword,
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/registration', handleRegistration);

authRouter.post('/login', handleLogin);

authRouter.get('/logout', handleLogout);

authRouter.get('/refresh', handleRefresh);

authRouter.get('/email/verify/:code', handleEmailVerification);

authRouter.post('/password/forgot', handleForgotPassword);

authRouter.post('/password/reset', handleResetPassword);

export default authRouter;
