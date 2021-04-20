/**
 * Function to generate a random OTP
 * @param {Number} size Size of the OTP
 * @return {Number} Generated OTP
 */
const generateOTP = (size) => Math.random().toFixed(size).split('.')[1];

/**
 *
 * Function to generates a random password
 *
 * @param length Length of the password
 * @returns {String} Randomly generated password
 */
const generateRandomPassword = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    password += chars.charAt(index);
  }
  return password;
};

export { generateOTP, generateRandomPassword };
