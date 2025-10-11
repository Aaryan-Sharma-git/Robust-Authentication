import express from 'express';
import connectToDB from './config/connectDB.js';
import { FRONTEND_URL, PORT } from './constants/env.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import authHandler from './middlewares/auth.middleware.js';
import sessionRouter from './routes/session.route.js';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// auth routes
app.use('/auth', authRouter);

// protected routes
app.use('/user', authHandler, userRouter);
app.use('/session', authHandler, sessionRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log('server started on port:', PORT);
  await connectToDB();
});

export default app;
