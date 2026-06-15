import { Router } from 'express';

import userRouter from './user.js';
import topicRouter from './topic.js';
import utilsRouter from './utils.js';
import pictureRouter from './picture.js';
import opinionRouter from './opinion.js';
import questionRouter from './question.js';
import notificationRouter from './notification.js';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/utils', utilsRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/pictures', pictureRouter);
apiRouter.use('/opinions', opinionRouter);
apiRouter.use('/questions', questionRouter);
apiRouter.use('/notifications', notificationRouter);

export default apiRouter;
