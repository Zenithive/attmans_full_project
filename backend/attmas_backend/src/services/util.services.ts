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
  const tmpDate = moment(targetDateStr, 'DD/MMM/YYYY');
  const offset = tmpDate.utcOffset();
  const startOfDay = tmpDate
    .utcOffset(offset)
    .set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .toDate();

  const endOfDay = tmpDate
    .utcOffset(offset)
    .set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
    .toDate();

  return {
    startOfDay,
    endOfDay,
  };
};
