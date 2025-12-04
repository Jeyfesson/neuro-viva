// =========================
// 📦 IMPORTAÇÕES PRINCIPAIS
// =========================
const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

// =========================
// 🚀 CONFIGURAÇÕES INICIAIS
// =========================
const app = express();

// =========================
// 🧩 ROTAS
// =========================
const authRoutes = require("./routes/auth");
const noticiasRoutes = require("./routes/noticias");
const usuariosRoutes = require("./routes/usuarios");
const categoriasRoutes = require("./routes/categorias");

// =========================
// ⚙️ MIDDLEWARES BÁSICOS
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// =========================
// 💾 SESSÕES
// =========================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "segredo",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware global — passa variáveis para todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.mensagem = req.session.mensagem || null;
  delete req.session.mensagem;
  next();
});

// =========================
// 🔐 MIDDLEWARE DE LOGIN
// =========================
function verificaLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect("/login");
  next();
}

// =========================
// 🌐 ROTAS
// =========================

// Rotas públicas (login, registro, notícias públicas)
app.use("/", authRoutes);
app.use("/", noticiasRoutes.public);

// Rotas protegidas — todos são iguais, basta estar logado
app.use("/noticias", verificaLogin, noticiasRoutes.admin);
app.use("/usuarios", verificaLogin, usuariosRoutes);
app.use("/categorias", verificaLogin, categoriasRoutes);

// Página inicial: redireciona para notícias
app.get("/", (req, res) => {
  if (!req.session.usuario) return res.redirect("/login");
  res.redirect("/noticias"); 
});

// =========================
// ⚠️ TRATAMENTO DE ERROS
// =========================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (req.accepts("html")) {
    return res.render("error", { titulo: "Erro", error: err });
  }
  res.json({ error: "Internal Server Error" });
});

// =========================
// 🧠 INICIALIZAÇÃO DO SERVIDOR (PORTA DINÂMICA)
// =========================
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ Porta ${port} em uso, tentando porta ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Erro ao iniciar o servidor:", err);
    }
  });
};

// Inicia na porta 3000
startServer(Number(process.env.PORT) || 3000);

module.exports = app;
