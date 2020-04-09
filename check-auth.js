const {sendError, createError} = require('micro');

const {API_SECRET} = process.env;

const checkAuth = (fn) => (request, response) => {
  if (!API_SECRET) {
    return fn(request, response);
  }

  if (
    request.headers.authorization &&
    request.headers.authorization.endsWith(API_SECRET)
  ) {
    return fn(request, response);
  }

  return sendError(request, response, createError(401, 'Unauthorized'));
};

module.exports = checkAuth;
