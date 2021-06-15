import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import NotificationController from '../controllers/notification';

const { findNotifications, updateHasRead, markAllAsRead } = new NotificationController();

const notificationRouter = Router();

notificationRouter.get('/', authenticateUser, findNotifications);
notificationRouter.post('/:id/has-read', authenticateUser, updateHasRead);
notificationRouter.post('/mark-all-as-read', authenticateUser, markAllAsRead);

export default notificationRouter;
