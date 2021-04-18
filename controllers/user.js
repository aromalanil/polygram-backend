import {
  validateName,
  validateEmail,
  validateString,
  validateUsername,
  validatePassword,
} from '../helpers/validation';

import User from '../models/user';
import { sendOTP } from '../helpers/email';
import { generateJWT } from '../helpers/jwt';
import { getFutureDate } from '../helpers/date';
import { generateOTP } from '../helpers/general';

export default class UserController {
  register = async (req, res) => {
    const { first_name, last_name, password, username, email } = req.body;

    // Validating request body
    try {
      validateEmail(email, 'email', true);
      validateName(last_name, 'last_name');
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
      await sendOTP(otp.data, email);
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

    res.status(200).json({ message: 'Account successfully verified' });
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
      return res.unauthorizedRequest('Password does not match');
    }

    // Generating JWT
    const token = generateJWT(username);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieExpiryDate = getFutureDate(7); // Cookie expires in 7 day
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      expires: cookieExpiryDate,
      sameSite: isProduction ? 'Lax' : 'none',
    });

    res.status(200).json({ message: 'Successfully Logged In' });
  };

  logout = async (req, res) => {
    // Deleting httpOnly cookie to logout cookie
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Successfully Logged Out' });
  };
}