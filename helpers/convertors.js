/**
 *
 * Function to convert String to Boolean
 * @param {String} data String which is to be converted to Boolean
 * @return {Boolean} Resultant Boolean
 */
const stringToBoolean = (data) => {
  switch (data) {
    case 'false':
    case '0':
      return false;

    case 'true':
    case '1':
      return true;

    default:
      throw new Error('Invalid Boolean');
  }
};

export { stringToBoolean };
