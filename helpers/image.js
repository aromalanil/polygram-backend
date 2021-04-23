import dotenv from 'dotenv';
import Picture from '../models/picture';
import { getRandomValueFromArray } from './general';

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

/**
 *
 * Generates a random avatar URL based on the name provided
 * @param {String} name The name of the user
 * @returns The url of the generated avatar
 */
export const getRandomAvatarURL = (name) => {
  const colorArray = [
    '6AB14D',
    '696DE1',
    '3F51B5',
    'FE6A6B',
    '5464FC',
    'F22E44',
    '3498E6',
    'FDA714',
    '5EFA8B',
    '2D2D2D',
    'FF649E',
    '7D4BC3',
  ];

  const randomColor = getRandomValueFromArray(colorArray);
  return `https://avatar.oxro.io/avatar.png?name=${name}&background=${randomColor}&caps=3`;
};
