/**
 *
 * A function which validates the page,limit wrt count &
 * returns the details of next, previous, first & last pages
 *
 * @param {Number} currentPage The current page number
 * @param {Number} resultPerPage Limit of number of result per page
 * @param {Number} count Total number of documents
 * @return {Object} Details of next, previous, first & last pages
 */
const getPaginationDetails = (currentPage, resultPerPage, count) => {
  if (resultPerPage < 1 || resultPerPage > 50) {
    throw new Error('limit can only be between 1 and 50');
  }
  if (currentPage < 1) {
    throw new Error('Invalid page number');
  }
  const totalPages = Math.ceil(count / resultPerPage);

  const paginationDetails = {};

  if (currentPage > 1) paginationDetails.first = { page: 1, perPage: resultPerPage };
  if (currentPage - 1 >= 1)
    paginationDetails.previous = { page: currentPage - 1, perPage: resultPerPage };
  if (currentPage + 1 <= totalPages)
    paginationDetails.next = { page: currentPage + 1, perPage: resultPerPage };
  if (currentPage < totalPages)
    paginationDetails.last = { page: totalPages, perPage: resultPerPage };

  return paginationDetails;
};

export { getPaginationDetails as default };
