const {ALLOWED_ORIGIN = '*'} = process.env;
const cors = fn => (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return 'ok';
  }

  return fn(req, res);
};

module.exports = cors;
