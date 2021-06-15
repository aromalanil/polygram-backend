import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['added-opinion', 'changed-password'],
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  has_read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    expires: '30d',
    default: () => new Date(),
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
