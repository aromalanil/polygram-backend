import mongoose from 'mongoose';

const pictureSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  content_type: {
    type: String,
    required: true,
  },
});

pictureSchema.index({ username: 1, type: 1 }, { unique: true });

const Picture = mongoose.model('Picture', pictureSchema);
export default Picture;
