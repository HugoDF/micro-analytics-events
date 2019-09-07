const micro = require('micro')
const handler = require('./handler');

const port = process.env.PORT || 3000;

const server = micro(handler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
