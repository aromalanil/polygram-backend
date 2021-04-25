import { createTransport } from 'nodemailer';
import {
  googleOAuthClient,
  googleRefreshToken,
  googleOAuthClientID,
  googleOAuthClientSecret,
} from './oauth';
import { generateOtpHTMLTemplate, generateOtpTextTemplate } from './template';

/**
 *
 * Function to send email to a specified email id
 * @param {String} emailID Email ID to which mail is to be send
 * @param {String} subject Subject of the otp
 * @param {String} textContent Content of the email as plain text
 * @param {String} htmlContent Content of the email as HTML
 */
export const sendEmail = async (emailID, subject, textContent, htmlContent) => {
  const accessToken = await googleOAuthClient.getAccessToken();

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      accessToken: accessToken.token,
      type: 'OAuth2',
      user: 'polywebapp@gmail.com',
      client_id: googleOAuthClientID,
      refreshToken: googleRefreshToken,
      client_secret: googleOAuthClientSecret,
    },
  });

  const mailOptions = {
    from: 'Poly Webapp <polywebapp@gmail.com>',
    to: emailID,
    subject: subject,
    text: textContent,
    html: htmlContent !== undefined ? htmlContent : `<p>${textContent}</p>`,
  };

  return transporter.sendMail(mailOptions);
};

/**
 *
 * Function to send OTP as email to a given email address.
 * @param {String|Number} otp OTP to be send
 * @param {String} email Email to which the OTP is to be send
 * @param {String} name Name of the user
 */
export const sendOTP = async (otp, email, name) => {
  const subject = 'One Time Password';
  const textContent = generateOtpTextTemplate(otp, name);
  const htmlContent = generateOtpHTMLTemplate(otp, name);

  await sendEmail(email, subject, textContent, htmlContent);
};
