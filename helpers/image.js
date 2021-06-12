import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Picture from '../models/picture';

// Configuring ENV variables
dotenv.config();

/**
 *
 * Uploads profile picture to the database and returns the URL to access it
 * @param {String} base64Image The image to be uploaded
 * @param {String} username Username of the person
 * @returns The URL to access the profile picture
 */
export const uploadProfilePicture = async (base64Image, username) => {
  const [metaData, base64Data] = base64Image.split(',');
  const contentType = metaData.substring(metaData.indexOf(':') + 1, metaData.indexOf(';'));

  const picture = new Picture({
    username,
    data: base64Data,
    type: 'profile_picture',
    content_type: contentType,
  });

  // Starting a transaction
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Picture.deleteOne({ username, type: 'profile_picture' }, { session });
      await picture.save({ session });
    });
  } catch (err) {
    return null;
  }

  const hostname = process.env.HOSTNAME;
  return `${hostname}/api/pictures/${picture._id}`;
};
