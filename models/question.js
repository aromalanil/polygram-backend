import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  topics: {
    type: [String],
    required: true,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
});

questionSchema.index({ title: 'text', content: 'text' });

const Question = mongoose.model('Question', questionSchema);
export default Question;
