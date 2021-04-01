import { Router } from 'express';

const apiRouter = new Router();

apiRouter.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World',
  });
});

export default apiRouter;
