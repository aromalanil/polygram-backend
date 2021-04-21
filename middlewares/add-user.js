import { validateJWT } from '../helpers/jwt';
import User from '../models/user';

/**
 *
 * Middleware which checks for the jwt in the request
 * and add the user to the request object if user exists.
 */
const addUser = async (req, res, next) => {
  // Fetching jwt from cookie
  const token = req.cookies.jwt;

  if (!token) {
    return next();
  }

  let username;
  try {
    username = validateJWT(token);
  } catch (err) {
    res.clearCookie('jwt'); // Logging out the user
    return next();
  }

  // Retrieving user from the database
  const user = await User.findOne({ username, verified: true });
  if (!user) {
    res.clearCookie('jwt'); // Logging out the user
    return next();
  }

  // Adding user to the request object
  req.user = user;
  next();
};

export default addUser;
