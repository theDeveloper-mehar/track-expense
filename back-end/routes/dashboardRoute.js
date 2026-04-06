import express from 'express';

import { getDashBoard } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/auth.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/',authMiddleware,getDashBoard);

export default dashboardRouter;