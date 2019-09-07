const { API_SECRET } = process.env

const checkAuth = fn => (req, res) => {
  if (!API_SECRET) {
    return fn(req, res);
  }
  if(req.headers.authorization && req.headers.authorization.endsWith(API_SECRET)) {
    return fn(req, res);
  }
  return sendError(req, res, createError(401, 'Unauthorized'));
}

module.exports = checkAuth;
