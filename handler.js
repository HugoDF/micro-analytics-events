const querystring = require('querystring');
const {json} = require('micro');
const db = require('./db');

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

module.exports = async req => {
  if (req.method === 'GET') {
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
  }

  try {
    const data = await json(req);
    const eventType = data.event_type;
    const date = new Date().toISOString();
    db.run(
      `INSERT INTO events (event_type, date) VALUES (?, ?)`,
      [eventType, date]
    );
    return 'logged';
  } catch (error) {
    console.error(error.stack);
    return 'noop';
  }
};
