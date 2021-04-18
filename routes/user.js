import { Router } from 'express';
import UserController from '../controllers/user';

const { register, login, verify } = new UserController();
const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/verify', verify);

export default userRouter;
