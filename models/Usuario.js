const db = require("../db");

module.exports = {
  async listar() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM usuarios ORDER BY id DESC", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  async buscarPorId(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async buscarPorEmail(email) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  async criar(usuario) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [usuario.nome, usuario.email, usuario.senha],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },

  async atualizar(id, usuario) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
        [usuario.nome, usuario.email, id],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  },

  async excluir(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM usuarios WHERE id = ?", [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};
