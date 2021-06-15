import { Router } from 'express';
import authenticateUser from '../middlewares/authenticate';
import NotificationController from '../controllers/notification';

const {
  updateHasRead,
  markAllAsRead,
  findNotifications,
  getNotificationCount,
} = new NotificationController();

const notificationRouter = Router();

notificationRouter.get('/', authenticateUser, findNotifications);
notificationRouter.get('/count', authenticateUser, getNotificationCount);
notificationRouter.post('/:id/has-read', authenticateUser, updateHasRead);
notificationRouter.post('/mark-all-as-read', authenticateUser, markAllAsRead);

export default notificationRouter;
