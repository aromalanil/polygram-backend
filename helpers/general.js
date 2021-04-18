/**
 * Function to generate a random OTP
 * @param {Number} size Size of the OTP
 * @return {Number} Generated OTP
 */
const generateOTP = (size) => Math.random().toFixed(size).split('.')[1];

export { generateOTP };
