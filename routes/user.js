import { Router } from 'express';
import UserController from '../controllers/user';
import authenticateUser from '../middlewares/authenticate';

const {
  login,
  verify,
  logout,
  sendOTP,
  register,
  googleOAuth,
  changePassword,
  forgotPassword,
} = new UserController();
const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify', verify);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/auth/google', googleOAuth);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/change-password', authenticateUser, changePassword);
userRouter.post('/logout', authenticateUser, logout);

export default userRouter;
