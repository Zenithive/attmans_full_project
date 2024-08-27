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
