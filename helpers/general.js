/**
 * Function to generate a random OTP
 * @param {Number} size Size of the OTP
 * @return {Number} Generated OTP
 */
export const generateOTP = (size) => Math.random().toFixed(size).split('.')[1];

/**
 *
 * Function to generates a random password
 *
 * @param length Length of the password
 * @returns {String} Randomly generated password
 */
export const generateRandomPassword = (length) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
  let password = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    password += chars.charAt(index);
  }
  return password;
};

/**
 *
 * Function to calculate the size of an image from base64 string
 * @param {String} base64String The image as base64 encoded string
 * @returns {Number} The size of the image in bytes
 */
export const calculateImageSize = (base64String) => {
  const data = base64String.split(',')[1];
  const padding = data.endsWith('==') ? 2 : 1;
  return (base64String.length / 4) * 3 - padding;
};

/**
 *
 * Function which returns a random value from the given array
 * @param {Array} array The array from which random value is to be picked
 * @returns Random value from the array
 */
export const getRandomValueFromArray = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Function to calculate percentage
 * @param {Number} part The part
 * @param {Number} whole the whole
 * @returns Calculated percentage
 */
export const calculatePercentage = (part, whole) => (part === whole ? 100 : (part / whole) * 100);
