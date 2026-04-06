import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);

//protected routes

userRouter.get('/me',authMiddleware , getUser);
userRouter.put('/profile',authMiddleware,updateProfile);
userRouter.put('/password',authMiddleware,updatePassword);

export default userRouter;