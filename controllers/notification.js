import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user';
import Notification from '../models/notification';
import { sendPushNotification as sendPush } from '../helpers/notification';

import {
  validateNumber,
  validateString,
  validateBoolean,
  validateMongooseId,
  validateStringArray,
} from '../helpers/validation';

// Configuring ENV variables
dotenv.config();

export default class NotificationController {
  static createNotification = (
    { message, receiver, type, sender, targetContentId },
    { session }
  ) => {
    validateString(message, 2, 160, 'message', true);
    validateString(type, 3, 30, 'type', true);

    const notification = new Notification({
      type,
      sender,
      message,
      receiver,
      target_content_id: targetContentId,
    });

    return notification.save({ session });
  };

  findNotifications = async (req, res) => {
    const { user } = req;
    const { before_id, after_id } = req.query;

    let { page_size = 5 } = req.query;
    page_size = parseInt(page_size, 10);

    // Validating request body
    try {
      validateMongooseId(before_id, 'before_id', false);
      validateMongooseId(after_id, 'after_id', false);
      validateNumber(page_size, 1, 50, 'page_size', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = { receiver: user._id };

    // If after_id is provided only include topics posted after after_id
    if (after_id) {
      query._id = { $gt: mongoose.Types.ObjectId(after_id) };
    } else if (before_id) {
      query._id = { $lt: mongoose.Types.ObjectId(before_id) };
    }

    const notifications = await Notification.find(query)
      .sort({ _id: 'descending' })
      .populate('sender', 'first_name last_name username profile_picture')
      .limit(page_size)
      .select('-__v')
      .lean();

    res.status(200).json({
      msg: 'Notifications Found',
      data: { notifications },
    });
  };

  getNotificationCount = async (req, res) => {
    const { user } = req;

    const count = await Notification.countDocuments({ receiver: user._id, has_read: false });

    res.status(200).json({
      msg: 'Notifications Found',
      data: { count },
    });
  };

  deleteNotification = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'notification_id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const notificationToDelete = await Notification.findById(id);
    if (!notificationToDelete) {
      return res.notFound('Notification not found');
    }

    // Checking if the user is the receiver of the question
    if (!notificationToDelete.receiver.equals(user._id)) {
      return res.unAuthorizedRequest("You don't have the permission to delete this question");
    }

    // Deleting notification from DB
    try {
      await notificationToDelete.delete();
    } catch (err) {
      return res.internalServerError('Error deleting notification');
    }

    res.status(200).json({
      msg: 'Notification deleted successfully',
      data: { notification: notificationToDelete },
    });
  };

  updateHasRead = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { has_read } = req.body;

    // Validating request body
    try {
      validateMongooseId(id, 'notification_id', true);
      validateBoolean(has_read, 'has_read', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const notification = await Notification.findById(id);

    if (!notification.receiver.equals(user._id)) {
      return res.unAuthorizedRequest("You don't have the permission to update this");
    }

    try {
      notification.has_read = has_read;
      await notification.save();
    } catch (err) {
      return res.internalServerError('Error updating has_read');
    }

    res.status(200).json({
      msg: has_read ? 'Notification marked as Read' : 'Notification marked as Unread',
    });
  };

  markAllAsRead = async (req, res) => {
    const { user } = req;

    try {
      await Notification.updateMany({ receiver: user._id }, { $set: { has_read: true } });
    } catch (err) {
      return res.internalServerError('Error updating notifications');
    }

    res.status(200).json({
      msg: 'All notifications marked as Read',
    });
  };

  subscribePushNotification = async (req, res) => {
    const { user } = req;
    const { subscription } = req.body;

    const subscriptionJson = JSON.parse(subscription);
    if (!subscriptionJson?.endpoint) {
      return res.badRequest('Invalid subscription');
    }

    try {
      user.push_subscription = subscription;
      await user.save();
    } catch (err) {
      return res.internalServerError('Error subscribing to push notification');
    }

    res.status(200).json({
      subscribed: true,
      msg: 'Successfully subscribed to push notification',
    });
  };

  unsubscribePushNotification = async (req, res) => {
    const { user } = req;

    try {
      user.push_subscription = null;
      await user.save();
    } catch (err) {
      return res.internalServerError('Error unsubscribing from push notification');
    }

    res.status(200).json({
      subscribed: false,
      msg: 'Successfully unsubscribed from push notification',
    });
  };

  sendPushNotification = async (req, res) => {
    const { master_password, usernames, title, body } = req.body;

    try {
      validateStringArray(usernames, 4, 15, 'usernames', 1, 100);
      validateString(title, 3, 50, 'title', true);
      validateString(body, 3, 150, 'body', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    if (master_password !== process.env.MASTER_PASSWORD) {
      return res.unAuthorizedRequest('You are not authorized to access this route');
    }

    const query = { push_subscription: { $ne: null } };
    if (usernames) {
      query.username = { $in: usernames };
    }

    const users = await User.find(query).select('push_subscription').lean();
    if (users.length === 0) {
      return res.status(200).json({ msg: 'No user found' });
    }

    const sendNotificationArray = users.map(({ push_subscription }) =>
      sendPush(push_subscription, title, body)
    );

    await Promise.allSettled(sendNotificationArray);

    res.status(200).json({ msg: 'All push notifications send successfully' });
  };
}
