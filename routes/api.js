import { Router } from 'express';

import userRouter from './user';
import topicRouter from './topic';
import utilsRouter from './utils';
import pictureRouter from './picture';
import opinionRouter from './opinion';
import questionRouter from './question';
import notificationRouter from './notification';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/utils', utilsRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/pictures', pictureRouter);
apiRouter.use('/opinions', opinionRouter);
apiRouter.use('/questions', questionRouter);
apiRouter.use('/notifications', notificationRouter);

export default apiRouter;
