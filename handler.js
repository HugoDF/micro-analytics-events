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

const processEnd = dateString => {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const handleGet = async req => {
  const {url} = req;
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

const handlePost = async (req) => {
  try {
    const data = await json(req);
    const eventType = data.event_type;
    const date = new Date().toISOString();
    db.run(`INSERT INTO events (event_type, date) VALUES (?, ?)`, [
      eventType,
      date
    ]);
    return 'logged';
  } catch (error) {
    return 'noop';
  }
};

module.exports = cors(
  checkAuth(async (req, res) => {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        return sendError(req, res, createError(501, 'Not Implemented'));
    }
  })
);
