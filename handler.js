const querystring = require('querystring');
const {json, sendError, createError} = require('micro');
const db = require('./db');
const checkAuth = require('./check-auth');
const cors = require('./cors');

const defaultStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString();
};

const defaultEnd = () => new Date().toISOString();

const processEnd = (dateString) => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const handleGet = async (request) => {
  const {url} = request;
  const q = url.split('?');
  const {
    start = defaultStart(),
    end = defaultEnd(),
    event_type
  } = querystring.parse(q.length > 0 ? q[1] : '');
  const values = {
    $start: new Date(start).toISOString(),
    $end: processEnd(end)
  };
  let eventTypeClause = '';
  if (event_type) {
    values.$event_type = event_type;
    eventTypeClause = `AND event_type = $event_type`;
  }

  const events = await db.select(
    `SELECT event_type, date
     FROM events
      WHERE datetime(date) >= datetime($start)
        AND datetime(date) <= datetime($end)
        ${eventTypeClause}`,
    values
  );
  return {events};
};

const handlePost = async (request) => {
  try {
    const data = await json(request);
    const eventType = data.event_type;
    const date = new Date().toISOString();
    db.run(`INSERT INTO events (event_type, date) VALUES (?, ?)`, [
      eventType,
      date
    ]);
    return 'logged';
  } catch (_) {
    return 'noop';
  }
};

const health = (fn) => (request, response) => {
  if (request.url === '/health') {
    return 'OK';
  }

  return fn(request, response);
};

module.exports = health(
  cors(
    checkAuth(async (request, response) => {
      switch (request.method) {
        case 'GET':
          return handleGet(request, response);
        case 'POST':
          return handlePost(request, response);
        default:
          return sendError(
            request,
            response,
            createError(501, 'Not Implemented')
          );
      }
    })
  )
);
