import { Request, Response } from 'express';
import SessionModel from '../models/session.model.js';
import { OK, UNAUTHORIZED } from '../constants/http.js';
import appAssert from '../utils/appAssert.js';

const handleGetSession = async (req: Request, res: Response) => {
  const sessionId = req.sessionId;
  const userId = req.userId;

  const sessions = await SessionModel.find(
    {
      userId: userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userId: 1,
      userAgent: 1,
      createdAt: 1,
    }
  ).sort({
    createdAt: -1,
  });

  res.status(OK).json(
    sessions.map((session) => ({
      ...session.toObject(), //the toObject makes the session a plain js object without any mongoose methods
      ...(session._id == sessionId && {
        isCurrent: true,
      }),
    }))
  );
  return;
};

const handleDeleteSession = async (req: Request, res: Response) => {
  const deletedSession = await SessionModel.deleteOne({
    _id: req.params.id,
    userId: req.userId,
  });
  appAssert(deletedSession, UNAUTHORIZED, 'not authorized to delete this session.');

  res.status(OK).json({
    message: 'session was removed.',
  });
  return;
};

export { handleGetSession, handleDeleteSession };
