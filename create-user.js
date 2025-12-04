const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");
const readline = require("readline");

// Caminho do banco SQLite
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

// Criando interface para ler do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para perguntar dados
rl.question("Nome: ", (nome) => {
  rl.question("Email: ", (email) => {
    rl.question("Senha: ", (senha) => {

      const senhaHash = bcrypt.hashSync(senha, 10);
      const perfil = "usuario"; // todos iguais

      db.run(
        "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
        [nome, email, senhaHash, perfil],
        function (err) {
          if (err) {
            console.error("Erro ao criar usuário:", err.message);
          } else {
            console.log("✅ Usuário criado com ID:", this.lastID);
          }
          db.close();
          rl.close();
        }
      );

    });
  });
});
