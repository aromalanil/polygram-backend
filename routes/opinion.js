import { Router } from 'express';
import addUser from '../middlewares/add-user';
import OpinionController from '../controllers/opinion';
import authenticateUser from '../middlewares/authenticate';

const {
  addUpvote,
  addOpinion,
  addDownvote,
  findOpinions,
  removeUpvote,
  removeOpinion,
  removeDownvote,
} = new OpinionController();

const opinionRouter = Router();

opinionRouter.get('/', addUser, findOpinions);
opinionRouter.post('/', authenticateUser, addOpinion);
opinionRouter.delete('/:id', authenticateUser, removeOpinion);
opinionRouter.post('/:id/upvote', authenticateUser, addUpvote);
opinionRouter.post('/:id/downvote', authenticateUser, addDownvote);
opinionRouter.delete('/:id/upvote', authenticateUser, removeUpvote);
opinionRouter.delete('/:id/downvote', authenticateUser, removeDownvote);

export default opinionRouter;
