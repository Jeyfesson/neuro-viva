const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, nome, email FROM usuarios", (err, rows) => {
  if (err) return console.error(err);
  console.table(rows);
  db.close();
});
