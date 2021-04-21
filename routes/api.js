import { Router } from 'express';

import userRouter from './user';
import topicRouter from './topic';
import questionRouter from './question';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/questions', questionRouter);
apiRouter.use('/topics', topicRouter);

export default apiRouter;
