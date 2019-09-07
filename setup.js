const db = require('./db');

const tables = `CREATE TABLE IF NOT EXISTS events
  (id TEXT, date STRING, event_type STRING);
`
db.run(tables);
