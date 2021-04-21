import { Router } from 'express';
import TopicController from '../controllers/topic';
import authenticateUser from '../middlewares/authenticate';

const { findTopic, findSingleTopic, followTopic, unFollowTopic } = new TopicController();

const topicRouter = Router();

topicRouter.get('/', findTopic);
topicRouter.get('/:id', findSingleTopic);
topicRouter.post('/follow', authenticateUser, followTopic);
topicRouter.post('/unfollow', authenticateUser, unFollowTopic);

export default topicRouter;
