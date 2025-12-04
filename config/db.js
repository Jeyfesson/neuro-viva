const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// cria o arquivo do banco dentro do projeto
const dbPath = path.join(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Erro ao conectar ao SQLite:", err);
  else console.log("✅ Banco SQLite conectado:", dbPath);
});

// cria tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT NOT NULL,
      perfil TEXT DEFAULT 'usuario',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
