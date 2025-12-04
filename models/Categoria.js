const db = require("../db");

module.exports = {
  async listar() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM categorias ORDER BY id DESC", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  async buscarPorId(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM categorias WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async criar(nome) {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO categorias (nome) VALUES (?)", [nome], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });
  },

  async atualizar(id, nome) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE categorias SET nome = ? WHERE id = ?", [nome, id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  async excluir(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM categorias WHERE id = ?", [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
