const sqlite = require('sqlite3');

const db = new sqlite.Database('.data/main.db');

db.select = function (sql, values) {
  return new Promise((resolve, reject) => {
    db.all(sql, values, (err, rows) => {
      if (err) return reject(err);
      return resolve(rows);
    });
  });
};

module.exports = db;
