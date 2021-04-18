/**
 *
 * Function to send OTP as email to a given mobile number.
 * @param {Number} otp OTP to be send
 * @param {String|Number} email Email to which the OTP is to be send
 */
const sendOTP = async (otp, email) => {
  // TODO Implement send otp logic
  console.log(`OTP:${otp} Send to ${email}`); // eslint-disable-line
};

export { sendOTP };
