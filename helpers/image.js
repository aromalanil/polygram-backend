import dotenv from 'dotenv';
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

  const image = await Picture.findOneAndUpdate(
    { username, type: 'profile_picture' },
    { $set: { data: base64Data, content_type: contentType } },
    { upsert: true, new: true }
  );

  const hostname = process.env.HOSTNAME;
  return `${hostname}/api/pictures/${image._id}`;
};
