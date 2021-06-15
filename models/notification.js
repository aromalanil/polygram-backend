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
  // The id of the resource that is to be targeted eg: For added-opinion it will be question_id
  target_content_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_at: {
    type: Date,
    expires: '30d',
    default: () => new Date(),
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
