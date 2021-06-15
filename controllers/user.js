import dotenv from 'dotenv';
import mongoose from 'mongoose';

import {
  validateName,
  validateEmail,
  validateImage,
  validateString,
  validateUsername,
  validatePassword,
} from '../helpers/validation';

import User from '../models/user';
import Opinion from '../models/opinion';
import Picture from '../models/picture';
import Question from '../models/question';
import { sendOTP } from '../helpers/email';
import { getFutureDate } from '../helpers/date';
import Notification from '../models/notification';
import NotificationController from './notification';
import { verifyGoogleIdToken } from '../helpers/oauth';
import { uploadProfilePicture } from '../helpers/image';
import { generateJWT, validateJWT } from '../helpers/jwt';
import { generateOTP, generateRandomPassword } from '../helpers/general';

// Configuring ENV variables
dotenv.config();

export default class UserController {
  #loginUser = (res, username) => {
    // Generating JWT
    const token = generateJWT(username);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieExpiryDate = getFutureDate(7); // Cookie expires in 7 day
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      expires: cookieExpiryDate,
      sameSite: isProduction ? 'none' : undefined,
    });
  };

  register = async (req, res) => {
    const { first_name, last_name, password, username, email } = req.body;

    // Validating request body
    try {
      validateEmail(email, 'email', true);
      validateString(last_name, 1, 30, 'last_name');
      validateName(first_name, 'first_name', true);
      validatePassword(password, 'password', true);
      validateUsername(username, 'username', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Checking if user with the given email already exist
    const doesEmailExist = await User.exists({ email, verified: true });
    if (doesEmailExist) {
      return res.conflict(`Email ID ${email} already exist`);
    }

    // Checking if user with the given username already exist
    const doesUsernameExist = await User.exists({ username, verified: true });
    if (doesUsernameExist) {
      return res.conflict(`Username ${username} already exist`);
    }

    // Deleting data of users with same credentials who are not verified
    await User.deleteMany({ $or: [{ username }, { email }], verified: false });

    // Generating the OTP
    const otp = { data: generateOTP(6), generated_at: new Date() };

    // Creating the user
    const user = new User({
      otp,
      email,
      password,
      username,
      last_name,
      first_name,
    });

    // Saving user to the database
    try {
      await user.save();
    } catch (err) {
      return res.internalServerError('Error creating user');
    }

    // Sending OTP to the user
    try {
      await sendOTP(otp.data, email, first_name);
    } catch (err) {
      return res.internalServerError('Error sending OTP');
    }

    res.status(201).json({ msg: 'User created successfully' });
  };

  verify = async (req, res) => {
    const { otp, username } = req.body;

    // Validating request body
    try {
      validateUsername(username, 'username', true);
      validateString(otp, 6, 6, 'otp', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Getting user with the provided username
    const user = await User.findOne({ username });

    // Checking if user exist or not.
    if (!user) {
      return res.notFound(`User with username ${username} does no exist`);
    }

    // Checking if account is already verified
    if (user.verified) {
      return res.conflict('This account is already verified');
    }

    // Verifying the OTP
    try {
      user.verifyOTP(otp);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Making user verified
    user.verified = true;

    // Expiring the OTP
    user.expireOTP();
    try {
      await user.save();
    } catch (err) {
      return res.internalServerError('Error saving the User');
    }

    this.#loginUser(res, username);

    res.status(200).json({ message: 'Account verified & Logged In' });
  };

  login = async (req, res) => {
    const { username, password } = req.body;

    // Validating request body
    try {
      validatePassword(password, 'password', true);
      validateUsername(username, 'username', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const user = await User.findOne({ username, verified: true });

    // Checking if user exist or not.
    if (!user) {
      return res.notFound(`User with username ${username} do no exist`);
    }

    // Comparing password
    const doesPasswordMatch = await user.comparePassword(password);
    if (!doesPasswordMatch) {
      return res.unAuthorizedRequest('Password does not match');
    }

    this.#loginUser(res, username);

    res.status(200).json({ message: 'Successfully Logged In' });
  };

  findUser = async (req, res) => {
    const { username } = req.params;

    // Validating request body
    try {
      validateUsername(username, 'username', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const user = await User.findOne({ username, verified: true })
      .select('-password -__v -otp -verified')
      .lean();

    if (!user) {
      return res.notFound('User not found');
    }

    res.status(200).json({ msg: 'User Found', data: { user } });
  };

  getDetails = async (req, res) => {
    const { user: loggedInUser } = req;

    // Removing unwanted fields
    const { password, __v, otp, verified, ...user } = loggedInUser.toJSON();

    res.status(200).json({ msg: 'User Found', data: { user } });
  };

  findIfUserIsLoggedIn = async (req, res) => {
    // Fetching jwt from cookie
    const token = req.cookies.jwt;

    // If token does not exist
    if (!token) {
      return res.status(200).json({ data: { is_user_logged_in: false } });
    }

    // Verifying jwt token
    let username;
    try {
      username = validateJWT(token);
    } catch (err) {
      res.clearCookie('jwt'); // Logging out the user
      return res.status(200).json({ data: { is_user_logged_in: false } });
    }

    // Checking if user exist in database
    const user = await User.exists({ username, verified: true });
    if (!user) {
      res.clearCookie('jwt'); // Logging out the user
      return res.status(200).json({ data: { is_user_logged_in: false } });
    }

    res.status(200).json({ data: { is_user_logged_in: true } });
  };

  editDetails = async (req, res) => {
    const { user } = req;
    const { first_name, last_name, bio } = req.body;

    // Validating request body
    try {
      validateName(first_name, 'first_name');
      validateString(last_name, 1, 30, 'last_name');
      validateString(bio, 5, 160, 'bio');
    } catch (err) {
      return res.badRequest(err.message);
    }

    user.bio = bio || user.bio;
    user.last_name = last_name || user.last_name;
    user.first_name = first_name || user.first_name;

    try {
      await user.save();
    } catch (err) {
      return res.internalServerError('Error updating the details');
    }

    res.status(200).json({ msg: 'User details updated successfully' });
  };

  forgotPassword = async (req, res) => {
    const { otp, new_password, email } = req.body;

    // Validating request body
    try {
      validateEmail(email, 'email', true);
      validateString(otp, 6, 6, 'otp', true);
      validatePassword(new_password, 'new_password', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const user = await User.findOne({ email, verified: true });

    // Checking if user exist or not.
    if (!user) {
      return res.notFound(`User with email ${email} do no exist`);
    }

    // Verifying the OTP
    try {
      user.verifyOTP(otp);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Expiring the OTP
    user.expireOTP();

    user.password = new_password;

    // Starting a transaction
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await user.save({ session });
        await NotificationController.createNotification(
          {
            message: 'The password of your account was changed recently',
            type: 'changed-password',
            receiver: user._id,
          },
          { session }
        );
      });
    } catch (err) {
      return res.internalServerError('Password could not changed');
    }

    res.status(200).json({ message: 'Password changed successfully' });
  };

  changePassword = async (req, res) => {
    const { user } = req;
    const { old_password, new_password } = req.body;

    // Validating request body
    try {
      validatePassword(old_password, 'old_password', true);
      validatePassword(new_password, 'new_password', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Verifying if password matches
    const doesPasswordMatch = await user.comparePassword(old_password);
    if (!doesPasswordMatch) {
      return res.unAuthorizedRequest('Password does not match');
    }

    // Updating user password
    user.password = new_password;

    // Starting a transaction
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await user.save({ session });
        await NotificationController.createNotification(
          {
            message: 'The password of your account was changed recently',
            type: 'changed-password',
            receiver: user._id,
          },
          { session }
        );
      });
    } catch (err) {
      return res.internalServerError('Password could not changed');
    }

    res.status(201).json({ message: 'Password changed successfully' });
  };

  logout = async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Deleting httpOnly cookie to logout the user
    res.clearCookie('jwt', { sameSite: isProduction ? 'none' : undefined, secure: isProduction });
    res.status(200).json({ message: 'Successfully Logged Out' });
  };

  sendOTP = async (req, res) => {
    const { email } = req.body;

    // Validating request body
    try {
      validateEmail(email, 'email', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const user = await User.findOne({ email, verified: true });

    // Checking if user exist or not.
    if (!user) {
      return res.notFound(`User with email ${email} do no exist`);
    }

    // Creating an OTP object
    const otp = { data: generateOTP(6), generated_at: new Date() };
    user.otp = otp;

    try {
      await user.save();
    } catch (err) {
      return res.internalServerError('Error saving Details');
    }

    // Sending OTP to the user
    try {
      await sendOTP(otp.data, email, user.first_name);
    } catch (err) {
      return res.internalServerError('Error sending OTP');
    }

    res.status(201).json({ message: 'OTP send' });
  };

  googleOAuth = async (req, res) => {
    const { token, type } = req.body;

    // Getting user details from google
    let ticket;
    try {
      ticket = await verifyGoogleIdToken(token);
    } catch (err) {
      return res.badRequest('Invalid token');
    }

    const {
      email,
      given_name: first_name,
      family_name: last_name,
      picture: profile_picture,
    } = ticket.getPayload();

    // Checking for existing user with given credentials
    let user = await User.findOne({ email, verified: true });

    // Creating new user if user does not exist
    if (!user) {
      if (type === 'login') {
        return res.notFound('User not found');
      }
      // Generating dummy data
      const otp = { data: generateOTP(6), generated_at: new Date(0) };
      const password = generateRandomPassword(10);
      user = new User({
        otp,
        email,
        password,
        last_name,
        first_name,
        verified: true,
        profile_picture,
        username: Date.now().toString(),
      });

      try {
        await user.save();
      } catch (err) {
        return res.internalServerError('Error creating new user');
      }
    }

    this.#loginUser(res, user.username);
    res.status(200).json({ msg: 'Logged In Successfully' });
  };

  updateProfilePicture = async (req, res) => {
    const { user } = req;
    const { image } = req.body;

    // Validating request body
    try {
      validateImage(image, 8 * 600, 8 * 1024 * 1024 * 2, 'image', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const image_url = await uploadProfilePicture(image, user.username);

    if (!image_url) {
      res.internalServerError('Error uploading the profile_picture');
    }

    try {
      await User.findByIdAndUpdate(user._id, {
        $set: { profile_picture: image_url },
      });
    } catch (err) {
      res.internalServerError('Error updating the profile_picture');
    }

    res.status(201).json({
      msg: 'Profile picture updated successfully',
      data: {
        profile_picture: image_url,
      },
    });
  };

  deleteAccount = async (req, res) => {
    const { user } = req;
    const { password } = req.body;

    // Validating request body
    try {
      validatePassword(password, 'password', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Verifying if password matches
    const doesPasswordMatch = await user.comparePassword(password);
    if (!doesPasswordMatch) {
      return res.unAuthorizedRequest('Password does not match');
    }

    // Starting a transaction
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await Question.deleteMany({ author: user._id }, { session });
        await Opinion.deleteMany({ author: user._id }, { session });
        await Picture.deleteMany({ username: user.username }, { session });
        await Notification.deleteMany(
          { $or: [{ sender: user._id }, { receiver: user._id }] },
          { session }
        );
        await user.delete({ session });
      });
    } catch (err) {
      return res.internalServerError('Error deleting question');
    }

    const isProduction = process.env.NODE_ENV === 'production';

    // Deleting httpOnly cookie to logout the user
    res.clearCookie('jwt', { sameSite: isProduction ? 'none' : undefined, secure: isProduction });
    res.status(200).json({ msg: 'Account deleted successfully' });
  };
}
