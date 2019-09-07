const sqlite = require('sqlite3');

const db = new sqlite.Database('.data/main.db');

module.exports = db;
