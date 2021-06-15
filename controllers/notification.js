import mongoose from 'mongoose';
import {
  validateNumber,
  validateString,
  validateBoolean,
  validateMongooseId,
} from '../helpers/validation';

import Notification from '../models/notification';

export default class NotificationController {
  static createNotification = ({ message, receiver, type, sender }, { session }) => {
    validateString(message, 2, 160, 'message', true);
    validateString(type, 3, 30, 'type', true);

    const notification = new Notification({
      type,
      sender,
      message,
      receiver,
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
      .populate('sender', 'first_name last_name username profile_picture')
      .select('-__v')
      .lean();

    res.status(200).json({
      msg: 'Notifications Found',
      data: { notifications },
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
}
