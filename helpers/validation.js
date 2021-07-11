import { calculateImageSize } from './general';

/**
 *
 * A validator function to validate any string using character limit
 * @param {String} data Data to be validated
 * @param {Number} minLength Minimum length the string can have
 * @param {Number} maxLength Maximum length the string can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateString = (data, minLength, maxLength, fieldName, isRequired = false) => {
  if (data !== undefined && data !== '') {
    if (typeof data !== 'string') {
      throw new Error(`${fieldName} must be of type string`);
    } else if (data.length < minLength) {
      throw new Error(`${fieldName} should contain at least ${minLength} characters`);
    } else if (data.length > maxLength) {
      throw new Error(`${fieldName} must not exceed the ${maxLength} character limit`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate any string using character limit
 * @param {Array.<String>} array String array to be validated
 * @param {Number} minLength Minimum length the each element in string array can have
 * @param {Number} maxLength Maximum length the each element in string array can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Number} [arrayMinLength] Minimum length the array must have
 * @param {Number} [arrayMaxLength] Maximum length the array can have
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateStringArray = (
  array,
  minLength,
  maxLength,
  fieldName,
  arrayMinLength,
  arrayMaxLength,
  isRequired = false
) => {
  if (array !== undefined && array !== null) {
    if (!Array.isArray(array)) {
      throw new Error(`${fieldName} must be of type array`);
    }
    if (arrayMaxLength !== undefined && array.length > arrayMaxLength) {
      throw new Error(`${fieldName} must not have more than ${arrayMaxLength} entries`);
    }
    if (arrayMinLength !== undefined && array.length < arrayMinLength) {
      throw new Error(`${fieldName} must have minimum ${arrayMinLength} entries`);
    }
    array.forEach((element) => {
      validateString(element, minLength, maxLength, `Each value in ${fieldName}`, isRequired);
    });
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate any number using length
 * @param {Number} data Data to be validated
 * @param {Number} lowerLimit Lower limit the data can have
 * @param {Number} upperLimit Upper limit the data can have
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateNumber = (data, lowerLimit, upperLimit, fieldName, isRequired = false) => {
  if (data !== undefined && data !== null) {
    if (typeof data !== 'number') {
      throw new Error(`${fieldName} must be of type number`);
    } else if (data < lowerLimit || data > upperLimit) {
      throw new Error(`Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate boolean
 * @param {Boolean} data Data to be validated
 * @param {String} fieldName Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateBoolean = (data, fieldName, isRequired = false) => {
  if (data !== undefined && data !== null) {
    if (typeof data !== 'boolean') {
      throw new Error(`${fieldName} must be of type boolean`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Date
 * @param {Date} date date to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
export const validateDate = (date, fieldName = 'Date', isRequired = false) => {
  if (date !== undefined && date !== null) {
    const dateObject = new Date(date);
    if (!(dateObject instanceof Date) || Number.isNaN(dateObject.getTime())) {
      throw new Error(`${fieldName} must be of type Date`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * Checks if the date is a valid date of birth
 * @param {Date} dateOfBirth Date of Birth to validate
 * @param {Number} [minimumAge] Minimum age the person should have
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
export const validateDateOfBirth = (
  dateOfBirth,
  minimumAge = 1,
  fieldName = 'Date of Birth',
  isRequired = false
) => {
  validateDate(dateOfBirth, fieldName, isRequired);

  if (dateOfBirth !== undefined && dateOfBirth !== null) {
    const currentDate = new Date();
    const minimumDOB = new Date();

    // Converting to date object
    const dateOfBirthObject = new Date(dateOfBirth);

    minimumDOB.setFullYear(currentDate.getFullYear() - minimumAge);

    if (minimumDOB.getTime() < dateOfBirthObject.getTime()) {
      throw new Error(`The person should be at least ${minimumAge} years old.`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Name
 * @param {String} name Name to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
export const validateName = (name, fieldName = 'Name', isRequired = false) => {
  validateString(name, 3, 30, fieldName, isRequired);

  if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

/**
 *
 * A validator function to validate Name
 * @param {String} url URL to be validated
 * @param {String} [fieldName] Field url to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
export const validateURL = (url, fieldName = 'URL', isRequired = false) => {
  validateString(url, 3, 2048, fieldName, isRequired);

  if (
    !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)$/.test(
      url
    )
  ) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

/**
 *
 * A validator function to validate Username
 * @param {String} username Username to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not.
 */
export const validateUsername = (username, fieldName = 'Username', isRequired = false) => {
  validateString(username, 4, 15, fieldName, isRequired);

  if (!/^[a-z0-9_-]*$/.test(username)) {
    throw new Error(
      `User name must only contain small letters, numbers, underscore( _ ) and hyphen( - )`
    );
  }
};

/**
 *
 * A validator function to validate Email Address
 * @param {String} email Email to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateEmail = (email, fieldName = 'Email', isRequired = false) => {
  validateString(email, 5, 50, fieldName, isRequired);

  if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

/**
 *
 * A validator function to validate Phone number
 * @param {String | Number} phoneNumber Phone number to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validatePhone = (phoneNumber, fieldName = 'Phone Number', isRequired = false) => {
  if (phoneNumber !== undefined) {
    if (!/^\d{10}$/.test(phoneNumber)) {
      throw new Error(`Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Gender
 * @param {String } gender Phone number to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateGender = (gender, fieldName = 'Gender', isRequired = false) => {
  const genderList = ['male', 'female', 'other'];
  if (gender !== undefined) {
    if (!genderList.includes(gender)) {
      throw new Error(`Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Password
 * @param {String} password Password to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validatePassword = (password, fieldName = 'Password', isRequired = false) => {
  validateString(password, 8, 50, fieldName, isRequired);

  if (password.search(/[a-z]/i) < 0) {
    throw new Error(`${fieldName} must contain at least one letter`);
  } else if (password.search(/[0-9]/) < 0) {
    throw new Error(`${fieldName} must contain at least one digit`);
  } else if (password.search(/[#?!@$ %^&*-]/) < 0) {
    throw new Error(`${fieldName} must contain at least one special character`);
  }
};

/**
 *
 * A validator function to validate ID
 * @param {String} id ID to be validated
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateMongooseId = (id, fieldName = 'Id', isRequired = false) => {
  if (id !== undefined) {
    if (typeof id !== 'string') {
      throw new Error(`${fieldName} must be of type string`);
    } else if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error(`Invalid ${fieldName}`);
    }
  } else if (isRequired) {
    throw new Error(`${fieldName} field cannot be empty`);
  }
};

/**
 *
 * A validator function to validate Image
 * @param {String} Image Image to be validated in base64 format
 * @param {Number} minimumSize Minimum size of the image in bytes
 * @param {Number} maximumSize Maximum size of the image in bytes
 * @param {String} [fieldName] Field name to be displayed in error message.
 * @param {Boolean} [isRequired] Is this field required or not
 */
export const validateImage = (
  image,
  minimumSize,
  maximumSize,
  fieldName = 'Image',
  isRequired = false
) => {
  validateString(image, 1, Infinity, 'image', isRequired);
  if (!/(image\/jpg|image\/png|image\/jpeg)/.test(image)) {
    throw new Error(`${fieldName} only supports png,jpeg & jpg`);
  }
  const imageSize = calculateImageSize(image);
  if (imageSize < minimumSize) {
    throw new Error(`${fieldName} should not be smaller than ${minimumSize / 1024}KB`);
  }
  if (imageSize > maximumSize) {
    throw new Error(`${fieldName} should not be larger than ${maximumSize / 1024}KB`);
  }
};
