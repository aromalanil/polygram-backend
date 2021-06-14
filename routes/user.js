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
  deleteAccount,
  changePassword,
  forgotPassword,
  updateProfilePicture,
  findIfUserIsLoggedIn,
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
userRouter.get('/is-logged-in', findIfUserIsLoggedIn);
userRouter.post('/edit', authenticateUser, editDetails);
userRouter.delete('/account', authenticateUser, deleteAccount);
userRouter.post('/change-password', authenticateUser, changePassword);
userRouter.post('/profile_picture', authenticateUser, updateProfilePicture);

userRouter.get('/:username', findUser);

export default userRouter;
