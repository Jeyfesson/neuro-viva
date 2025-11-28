const express = require("express");
const routerPublic = express.Router();
const routerAdmin = express.Router();
const InformacaoController = require("../controllers/InformacaoController");
const asyncHandler = require("../middleware/asyncHandler");

// Public routes
routerPublic.get("/", asyncHandler(InformacaoController.indexPublic));
routerPublic.get("/noticia/:id", asyncHandler(InformacaoController.viewNoticia));
routerPublic.get(
  "/categoria/:id",
  asyncHandler(InformacaoController.listarPorCategoria)
);

// Admin routes (these will be mounted under /admin/noticias)
routerAdmin.get("/", asyncHandler(InformacaoController.listarAdmin));
routerAdmin.get("/nova", asyncHandler(InformacaoController.novaForm));
routerAdmin.post("/nova", asyncHandler(InformacaoController.criar));
routerAdmin.get("/editar/:id", asyncHandler(InformacaoController.editarForm));
routerAdmin.post("/editar/:id", asyncHandler(InformacaoController.atualizar));
routerAdmin.post("/deletar/:id", asyncHandler(InformacaoController.deletar));

module.exports = { public: routerPublic, admin: routerAdmin };
