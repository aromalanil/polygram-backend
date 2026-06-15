import { Router } from 'express';
import addUser from '../middlewares/add-user.js';
import TopicController from '../controllers/topic.js';
import authenticateUser from '../middlewares/authenticate.js';

const {
  findTopics,
  followTopic,
  unFollowTopic,
  findSingleTopic,
  getTrendingTopics,
} = new TopicController();

const topicRouter = Router();

topicRouter.get('/', addUser, findTopics);
topicRouter.get('/trending', addUser, getTrendingTopics);
topicRouter.get('/single/:name', addUser, findSingleTopic);
topicRouter.post('/follow', authenticateUser, followTopic);
topicRouter.post('/unfollow', authenticateUser, unFollowTopic);

export default topicRouter;
