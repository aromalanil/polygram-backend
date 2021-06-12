import { Router } from 'express';
import UtilsController from '../controllers/utils';

const { getLinkPreview } = new UtilsController();

const utilsRouter = Router();

utilsRouter.get('/link-preview', getLinkPreview);

export default utilsRouter;
