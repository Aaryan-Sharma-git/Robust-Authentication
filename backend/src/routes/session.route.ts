import express from 'express';
import { handleGetSession, handleDeleteSession } from '../controllers/session.controller.js';

const sessionRouter = express.Router();

sessionRouter.get('/', handleGetSession);

sessionRouter.delete('/:id', handleDeleteSession);

export default sessionRouter;
