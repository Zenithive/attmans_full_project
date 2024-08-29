import * as moment from 'moment';

export const getPageParams = (page) => {
  // Convert page and limit to integers
  const limit = 10;
  const pageNumber = parseInt(page);
  const limitNumber = limit;

  // Calculate the skip value for pagination
  const skip = (pageNumber - 1) * limitNumber;

  return {
    skip,
    limitNumber,
    pageNumber,
  };
};

export const getSameDateISOs = (targetDateStr) => {
  // Create the start and end of the target date
  const startOfDay = moment.utc(targetDateStr, 'DD/MMM/YYYY').toDate();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = moment.utc(targetDateStr, 'DD/MMM/YYYY').toDate();
  endOfDay.setUTCHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
};
