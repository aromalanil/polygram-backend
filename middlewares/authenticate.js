import { validateJWT } from '../helpers/jwt';
import User from '../models/user';

const authenticateUser = async (req, res, next) => {
  // Fetching jwt from cookie
  const token = req.cookies.jwt;

  if (!token) {
    return res.unAuthorizedRequest('You are not logged in');
  }

  let username;
  try {
    username = validateJWT(token);
  } catch (err) {
    res.clearCookie('jwt'); // Logging out the user
    return res.forbiddenRequest('Invalid jwt token');
  }

  // Retrieving user from the database
  const user = await User.findOne({ username, verified: true });
  if (!user) {
    res.clearCookie('jwt'); // Logging out the user
    return res.unAuthorizedRequest('User no more exist in the database');
  }

  // Adding user to the request object
  req.user = user;
  next();
};

export default authenticateUser;
