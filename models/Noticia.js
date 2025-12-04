const db = require("../config/db");

class Noticia {
  constructor({
    id,
    titulo,
    conteudo,
    id_categoria,
    id_autor,
    data_publicacao,
  }) {
    this.id = id;
    this.titulo = titulo;
    this.conteudo = conteudo;
    this.id_categoria = id_categoria;
    this.id_autor = id_autor;
    this.data_publicacao = data_publicacao;
  }

  // === LISTAR todas as notícias ===
  static listar(limit = 20) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT n.id, n.titulo, SUBSTR(n.conteudo, 1, 300) AS resumo,
               n.data_publicacao, c.nome AS categoria, u.username AS autor
        FROM noticias n
        LEFT JOIN categorias c ON n.id_categoria = c.id
        LEFT JOIN usuarios u ON n.id_autor = u.id
        ORDER BY n.data_publicacao DESC
        LIMIT ?
        `,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // === BUSCAR notícia por ID ===
  static buscarPorId(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT n.*, c.nome AS categoria, u.username AS autor, u.id AS autor_id
        FROM noticias n
        LEFT JOIN categorias c ON n.id_categoria = c.id
        LEFT JOIN usuarios u ON n.id_autor = u.id
        WHERE n.id = ?
        `,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // === LISTAR notícias por categoria ===
  static listarPorCategoria(id_categoria) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT n.id, n.titulo, SUBSTR(n.conteudo, 1, 300) AS resumo,
               n.data_publicacao, c.nome AS categoria, u.username AS autor
        FROM noticias n
        LEFT JOIN categorias c ON n.id_categoria = c.id
        LEFT JOIN usuarios u ON n.id_autor = u.id
        WHERE n.id_categoria = ?
        ORDER BY n.data_publicacao DESC
        `,
        [id_categoria],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // === SALVAR nova notícia ===
  async salvar() {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO noticias (titulo, conteudo, id_categoria, id_autor) VALUES (?, ?, ?, ?)",
        [this.titulo, this.conteudo, this.id_categoria, this.id_autor],
        function (err) {
          if (err) reject(err);
          else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  // === ATUALIZAR notícia ===
  async atualizar() {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE noticias SET titulo = ?, conteudo = ?, id_categoria = ? WHERE id = ?",
        [this.titulo, this.conteudo, this.id_categoria, this.id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  // === DELETAR notícia ===
  static deletar(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM noticias WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }
}

module.exports = Noticia;
