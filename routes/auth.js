const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../config/db");

// Página de login
router.get("/login", (req, res) => {
  res.render("login", { titulo: "Login" });
});

// Página de cadastro
router.get("/register", (req, res) => {
  res.render("register", { titulo: "Cadastro" });
});

// Cadastro
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.session.mensagem = { tipo: "erro", texto: "Preencha todos os campos!" };
    return res.redirect("/register");
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare(
      "INSERT INTO usuarios (username, password, perfil) VALUES (?, ?, 'usuario')"
    );
    stmt.run(username, hash, (err) => {
      if (err) {
        console.error(err);
        req.session.mensagem = { tipo: "erro", texto: "Usuário já existe!" };
        return res.redirect("/register");
      }
      req.session.mensagem = { tipo: "sucesso", texto: "Cadastro realizado!" };
      res.redirect("/login");
    });
    stmt.finalize();
  } catch (err) {
    console.error(err);
    req.session.mensagem = { tipo: "erro", texto: "Erro interno." };
    res.redirect("/register");
  }
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user) {
        req.session.mensagem = { tipo: "erro", texto: "Usuário não encontrado." };
        return res.redirect("/login");
      }

      const senhaCorreta = await bcrypt.compare(password, user.password);
      if (!senhaCorreta) {
        req.session.mensagem = { tipo: "erro", texto: "Senha incorreta." };
        return res.redirect("/login");
      }

      // Login OK
      req.session.usuario = user;

      // Redirecionamento inteligente:
      if (user.perfil === "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/categorias");
      }
    }
  );
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
