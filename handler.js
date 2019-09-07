const querystring = require('querystring');
const {json} = require('micro');
const db = require('./db');

function select(sql, values) {
  return new Promise((resolve, reject) => {
    db.all(sql, values, (err, rows) => {
      if (err) return reject(err);
      return resolve(rows);
    });
  });
}

const defaultStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString();
};

const defaultEnd = () => {
  const d = new Date();
  return d.toISOString();
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
      $end: new Date(end).toISOString()
    };
    let eventTypeClause = '';
    if (event_type) {
      values.$event_type = event_type;
      eventTypeClause = `AND event_type = $event_type;`;
    }

    const events = await select(
      `SELECT event_type, date FROM events WHERE date >= $start AND date <= $end ${eventTypeClause}`,
      values
    );
    return {events};
  }

  try {
    const data = await json(req);
    const eventType = data.event_type;
    const date = new Date().toISOString();
    db.run(
      `INSERT INTO events (event_type, date) VALUES (?, ?)`[(eventType, date)]
    );
    return 'logged';
  } catch (error) {
    return 'noop';
  }
};
