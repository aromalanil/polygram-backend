import { Router } from 'express';
import addUser from '../middlewares/add-user';
import QuestionController from '../controllers/question';
import authenticateUser from '../middlewares/authenticate';

const { findSingleQuestion, createQuestion, findQuestions } = new QuestionController();

const questionRouter = Router();

questionRouter.get('/', addUser, findQuestions);
questionRouter.get('/:id', findSingleQuestion);
questionRouter.post('/', authenticateUser, createQuestion);

export default questionRouter;
