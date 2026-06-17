import dotenv from 'dotenv';
import { Resend } from 'resend';
import { generateOtpHTMLTemplate, generateOtpTextTemplate } from './template.js';

// Configuring ENV variables
dotenv.config();

const resend = new Resend(process.env.RESENT_API_KEY);

/**
 *
 * Function to send email to a specified email id
 * @param {String} emailID Email ID to which mail is to be send
 * @param {String} subject Subject of the otp
 * @param {String} textContent Content of the email as plain text
 * @param {String} htmlContent Content of the email as HTML
 */
export const sendEmail = async (emailID, subject, textContent, htmlContent) => {
  const { data, error } = await resend.emails.send({
    from: 'Polygram <no-reply@polygram.aromalanil.in>',
    to: [emailID],
    subject: subject,
    text: textContent,
    html: htmlContent !== undefined ? htmlContent : `<p>${textContent}</p>`,
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 *
 * Function to send OTP as email to a given email address.
 * @param {String|Number} otp OTP to be send
 * @param {String} email Email to which the OTP is to be send
 * @param {String} name Name of the user
 */
export const sendOTP = (otp, email, name) => {
  const subject = 'One Time Password';
  const textContent = generateOtpTextTemplate(otp, name);
  const htmlContent = generateOtpHTMLTemplate(otp, name);

  return sendEmail(email, subject, textContent, htmlContent);
};
