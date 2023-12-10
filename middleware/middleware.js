/**
 * Logs the request to the console.
 *
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @param {Function} next The next middleware function in the chain.
 * @returns {Promise<void>}
 */
export const logRequest = async (req, res, next) => {
  // Log the request method and URL to the console.
  console.log(`${req.method} ${req.url}`);

  // Call the next middleware function in the chain.
  await next();
};
