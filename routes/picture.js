import { Router } from 'express';
import PictureController from '../controllers/picture.js';

const { getPicture } = new PictureController();
const pictureRouter = Router();

pictureRouter.get('/:id', getPicture);

export default pictureRouter;
