const sqlite3 = require("sqlite3").verbose();

function querySQLite(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./database/backup.sqlite", (err) => {
      if (err) reject(err);
    });

    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
      db.close();
    });
  });
}

module.exports = { querySQLite };
