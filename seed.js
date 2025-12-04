const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

// Caminho do banco
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Apaga tabelas antigas, se existirem
  db.run("DROP TABLE IF EXISTS noticias");
  db.run("DROP TABLE IF EXISTS categorias");
  db.run("DROP TABLE IF EXISTS usuarios");

  // Cria tabelas
  db.run(`
    CREATE TABLE usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL DEFAULT 'usuario'
    )
  `);

  db.run(`
    CREATE TABLE categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE noticias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      categoria_id INTEGER,
      usuario_id INTEGER,
      data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // Cria um usuário padrão
  const senhaHash = bcrypt.hashSync("1234", 10); // senha: 1234
  db.run(
    "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
    ["Teste", "teste@email.com", senhaHash, "usuario"]
  );

  console.log("Banco criado e usuário padrão inserido!");
});

db.close();
