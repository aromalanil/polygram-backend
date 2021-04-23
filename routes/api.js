import { Router } from 'express';

import userRouter from './user';
import topicRouter from './topic';
import pictureRouter from './picture';
import opinionRouter from './opinion';
import questionRouter from './question';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/pictures', pictureRouter);
apiRouter.use('/opinions', opinionRouter);
apiRouter.use('/questions', questionRouter);

export default apiRouter;
