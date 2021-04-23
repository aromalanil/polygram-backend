import { Router } from 'express';
import PictureController from '../controllers/picture';

const { getPicture } = new PictureController();
const pictureRouter = Router();

pictureRouter.get('/:id', getPicture);

export default pictureRouter;
