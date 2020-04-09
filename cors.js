const {ALLOWED_ORIGIN = '*'} = process.env;
const cors = (fn) => (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (request.method === 'OPTIONS') {
    return 'ok';
  }

  return fn(request, response);
};

module.exports = cors;
