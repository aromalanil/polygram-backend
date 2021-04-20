import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
});

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
