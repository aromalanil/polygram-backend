import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configuring ENV variables
dotenv.config();

/**
 *
 * Function to generate a jwt which expires in 7d
 * @param {String} username The username to be added in the jwt
 * @returns The generated jsonwebtoken
 */
export const generateJWT = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * Function to validate the jsonwebtoken
 * @param {String} token The jsonwebtoken to be validated
 * @returns The username decoded from the jsonwebtoken
 */
export const validateJWT = (token) => {
  const { username } = jwt.verify(token, process.env.JWT_SECRET);
  return username;
};
