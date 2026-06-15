import { Router } from 'express';
import addUser from '../middlewares/add-user.js';
import QuestionController from '../controllers/question.js';
import authenticateUser from '../middlewares/authenticate.js';

const {
  findQuestions,
  removeQuestion,
  createQuestion,
  findSingleQuestion,
} = new QuestionController();

const questionRouter = Router();

questionRouter.get('/', addUser, findQuestions);
questionRouter.get('/:id', addUser, findSingleQuestion);
questionRouter.post('/', authenticateUser, createQuestion);
questionRouter.delete('/:id', authenticateUser, removeQuestion);

export default questionRouter;
