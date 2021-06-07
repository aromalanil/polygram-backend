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

  // Starting a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  const picture = new Picture({
    username,
    data: base64Data,
    type: 'profile_picture',
    content_type: contentType,
  });

  // Deleting question & all opinions on that question from DB
  const updates = [
    Picture.deleteOne({ username, type: 'profile_picture' }, { session }),
    picture.save({ session }),
  ];

  try {
    await Promise.all(updates);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    return null;
  } finally {
    session.endSession();
  }

  const hostname = process.env.HOSTNAME;
  return `${hostname}/api/pictures/${picture._id}`;
};
