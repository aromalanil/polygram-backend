import { Router } from 'express';
import UserController from '../controllers/user';
import authenticateUser from '../middlewares/authenticate';

const {
  login,
  verify,
  logout,
  sendOTP,
  findUser,
  register,
  getDetails,
  editDetails,
  googleOAuth,
  changePassword,
  forgotPassword,
  updateProfilePicture,
} = new UserController();
const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/verify', verify);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/register', register);
userRouter.post('/auth/google', googleOAuth);
userRouter.get('/', authenticateUser, getDetails);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/logout', authenticateUser, logout);
userRouter.post('/edit', authenticateUser, editDetails);
userRouter.post('/change-password', authenticateUser, changePassword);
userRouter.post('/profile_picture', authenticateUser, updateProfilePicture);

userRouter.get('/:username', findUser);

export default userRouter;
