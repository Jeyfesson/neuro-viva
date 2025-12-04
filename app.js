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

// Middleware global — passa variáveis pra todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.mensagem = req.session.mensagem || null;
  delete req.session.mensagem;
  next();
});

// =========================
// 🔐 MIDDLEWARES DE AUTENTICAÇÃO
// =========================
function verificaLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect("/login");
  next();
}

function verificaAdmin(req, res, next) {
  if (!req.session.usuario || req.session.usuario.perfil !== "admin") {
    req.session.mensagem = {
      tipo: "erro",
      texto: "Acesso negado: admin apenas.",
    };
    return res.redirect("/");
  }
  next();
}

// =========================
// 🌐 ROTAS PÚBLICAS E ADMIN
// =========================
app.use("/", authRoutes); // login e registro
app.use("/", noticiasRoutes.public); // rotas públicas de notícias

// Rotas protegidas
app.use("/admin/noticias", verificaLogin, noticiasRoutes.admin);
app.use("/admin/usuarios", verificaLogin, verificaAdmin, usuariosRoutes);
app.use("/admin/categorias", verificaLogin, verificaAdmin, categoriasRoutes);

// Página principal (redireciona pro index de notícias)
app.get("/", (req, res) => {
  res.redirect("/"); // redireciona para rota pública de notícias
});

// Painel Admin
app.get("/admin", verificaLogin, (req, res) => {
  res.render("admin/dashboard", { titulo: "Dashboard", layout: "admin" });
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
      startServer(port + 1); // tenta a próxima porta
    } else {
      console.error("Erro ao iniciar o servidor:", err);
    }
  });
};

// Inicia na porta 3000 ou próxima livre
startServer(Number(process.env.PORT) || 3000);

module.exports = app;
