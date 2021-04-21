import { Router } from 'express';
import addUser from '../middlewares/add-user';
import QuestionController from '../controllers/question';
import authenticateUser from '../middlewares/authenticate';

const {
  findQuestions,
  removeQuestion,
  createQuestion,
  findSingleQuestion,
} = new QuestionController();

const questionRouter = Router();

questionRouter.get('/', addUser, findQuestions);
questionRouter.get('/:id', findSingleQuestion);
questionRouter.post('/', authenticateUser, createQuestion);
questionRouter.delete('/:id', authenticateUser, removeQuestion);

export default questionRouter;
