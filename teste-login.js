const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"));

// Troque pelo usuário que quer testar
const emailTeste = "admin@email.com";
const senhaTeste = "1234";

db.get("SELECT * FROM usuarios WHERE email = ?", [emailTeste], (err, usuario) => {
  if (err) return console.error("Erro no banco:", err);
  if (!usuario) return console.log("Usuário não encontrado");

  const senhaCorreta = bcrypt.compareSync(senhaTeste, usuario.senha);
  console.log(senhaCorreta ? "Senha correta!" : "Senha incorreta");
  
  db.close();
});
