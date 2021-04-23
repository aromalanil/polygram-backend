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
  updateProfilePicture,
} = new UserController();
const userRouter = Router();

// TODO Add edit profile route
userRouter.post('/login', login);
userRouter.post('/verify', verify);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/register', register);
userRouter.post('/auth/google', googleOAuth);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/logout', authenticateUser, logout);
userRouter.post('/change-password', authenticateUser, changePassword);
userRouter.post('/profile_picture', authenticateUser, updateProfilePicture);

export default userRouter;
