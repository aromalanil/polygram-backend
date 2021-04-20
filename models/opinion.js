import mongoose from 'mongoose';

const opinionSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    option: {
      type: String,
      required: true,
    },
    upvotes: {
      type: [String],
      required: true,
    },
    downvotes: {
      type: [String],
      required: true,
    },
    created_at: {
      type: Date,
      default: () => new Date(),
    },
  },
  { toJSON: { virtuals: true } }
);

opinionSchema.virtual('upvote_count').get(function () {
  return this.upvotes.length;
});
opinionSchema.virtual('downvote_count').get(function () {
  return this.downvotes.length;
});
opinionSchema.virtual('upvote_downvote_difference').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

const Opinion = mongoose.model('Opinion', opinionSchema);
export default Opinion;
