const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Caminho do banco
const dbPath = path.join(__dirname, "..", "database.sqlite");
const db = new sqlite3.Database(dbPath);

// ==========================
// 🔐 Rota de login
// =========================
router.get("/login", (req, res) => {
  res.render("login", { titulo: "Login" });
});

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, usuario) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro no servidor.");
    }

    if (!usuario) {
      req.session.mensagem = { tipo: "erro", texto: "Usuário não encontrado." };
      return res.redirect("/login");
    }

    // Verifica senha
    if (!bcrypt.compareSync(senha, usuario.senha)) {
      req.session.mensagem = { tipo: "erro", texto: "Senha incorreta." };
      return res.redirect("/login");
    }

    // Salva o usuário na sessão
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    res.redirect("/"); // ou outra rota após login
  });
});

// ==========================
// 📝 Rota de registro
// =========================
router.get("/register", (req, res) => {
  res.render("register", { titulo: "Registrar" });
});

router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  // Hash da senha
  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
    [nome, email, senhaHash, "usuario"], // perfil único
    function (err) {
      if (err) {
        console.error(err);
        req.session.mensagem = { tipo: "erro", texto: "Erro ao criar usuário." };
        return res.redirect("/register");
      }

      req.session.mensagem = { tipo: "sucesso", texto: "Usuário criado com sucesso!" };
      res.redirect("/login");
    }
  );
});

// ==========================
// 🔒 Logout
// =========================
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
