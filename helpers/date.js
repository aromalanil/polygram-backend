/**
 *
 * Check whether the given date is older than current date
 * @param {Date} date Date to check
 * @return {Boolean} Is the date older or not
 */
export const isDateOlder = (date) => Date.now() > date.getTime();

/**
 *
 * Adds the given number of days to the given date an returns the new date
 * @param {Date} date The date to which days are to be added
 * @param {Number} days No of days to be added to the Date
 * @return {Date} New date after modification
 */
export const addDaysToDate = (date, days) => {
  date.setDate(date.getDate() + days);
  return date;
};

/**
 *
 * Returns todays date with 12:00am as time
 * @return {Date} Todays date with 12:00am as time
 */
export const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 *
 * Calculate how many minutes before the given date was.
 * @param {Date} date The date to be checked
 * @return {Number} Minutes
 */
export const getMinutesBefore = (date) => {
  const currentDate = Date.now();
  const secondsDifference = (currentDate - date.getTime()) / 1000;
  return Math.abs(Math.round(secondsDifference / 60));
};

/**
 *
 * Function to check if from and to date are valid
 * & they have a valid no of month difference
 * @param {Date} fromDate The from date
 * @param {Date} toDate The to date
 * @param {Number} maxMonthDifference The number of months of difference the from and to date can have
 */
export const isFromToValid = (fromDate, toDate, maxMonthDifference) => {
  if (fromDate.getTime() > toDate.getTime()) {
    throw new Error('From date must be lesser than the To date');
  }

  const monthDifference =
    toDate.getMonth() - fromDate.getMonth() + 12 * (toDate.getFullYear() - fromDate.getFullYear());

  if (monthDifference > maxMonthDifference) {
    throw new Error(`From date and to date can have a maximum of ${maxMonthDifference} difference`);
  }
};

/**
 *
 * Returns the date after the given number of days
 * @param {Number} days The number of days from now
 * @returns {Date} The date after this given number of days
 */
export const getFutureDate = (days) => {
  const currentDate = Date.now();
  return new Date(currentDate + days * 86400000);
};

/**
 *
 * Function returns a date in future after the given days
 * if given date is old. If given date is in the future,
 * function returns a date after given days after the provided date
 * @param {Date} date The date whose validity is to be extended
 * @param {Number} days Number of days to be added to the date.
 */
export const extendValidity = (date, days) => {
  // If the given date is older, replace it with current date
  if (isDateOlder(date)) {
    return addDaysToDate(new Date(), days);
  }

  return addDaysToDate(date, days);
};
