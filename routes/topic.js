import { Router } from 'express';
import addUser from '../middlewares/add-user';
import TopicController from '../controllers/topic';
import authenticateUser from '../middlewares/authenticate';

const { findTopic, findSingleTopic, followTopic, unFollowTopic } = new TopicController();

const topicRouter = Router();

topicRouter.get('/', addUser, findTopic);
topicRouter.get('/:id', addUser, findSingleTopic);
topicRouter.post('/follow', authenticateUser, followTopic);
topicRouter.post('/unfollow', authenticateUser, unFollowTopic);

export default topicRouter;
