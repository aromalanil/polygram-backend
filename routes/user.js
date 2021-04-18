import { Router } from 'express';
import UserController from '../controllers/user';
import authenticateUser from '../middlewares/authenticate';

const { register, login, verify, logout, sendOTP } = new UserController();
const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify', verify);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/logout', authenticateUser, logout);

export default userRouter;
