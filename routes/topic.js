import { Router } from 'express';
import addUser from '../middlewares/add-user';
import TopicController from '../controllers/topic';
import authenticateUser from '../middlewares/authenticate';

const { findTopic, followTopic, unFollowTopic, getTrendingTopics } = new TopicController();

const topicRouter = Router();

topicRouter.get('/', addUser, findTopic);
topicRouter.get('/trending', addUser, getTrendingTopics);
topicRouter.post('/follow', authenticateUser, followTopic);
topicRouter.post('/unfollow', authenticateUser, unFollowTopic);

export default topicRouter;
