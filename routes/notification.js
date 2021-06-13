import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import NotificationController from '../controllers/notification';

const { findNotifications, updateHasRead } = new NotificationController();

const notificationRouter = Router();

notificationRouter.get('/', authenticateUser, findNotifications);
notificationRouter.post('/:id/has-read', authenticateUser, updateHasRead);
export default notificationRouter;
