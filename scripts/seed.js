require("dotenv").config();
const db = require("../config/db");
const bcrypt = require("bcrypt");

async function run() {
  try {
    // create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        senha VARCHAR(255),
        perfil ENUM('admin','editor','leitor') DEFAULT 'editor'
      ) ENGINE=INNODB;
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100)
      ) ENGINE=INNODB;
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS noticias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(200),
        conteudo TEXT,
        id_categoria INT,
        id_autor INT,
        data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL,
        FOREIGN KEY (id_autor) REFERENCES usuarios(id) ON DELETE SET NULL
      ) ENGINE=INNODB;
    `);

    // inserir categorias iniciais
    const categoriasIniciais = [
      "TDAH",
      "Autismo",
      "Dislexia",
      "Altas Habilidades / Superdotação",
      "Psicopedagogia",
      "Educação Inclusiva",
      "Comportamento"
    ];

    let catId = null;

    for (const nome of categoriasIniciais) {
      const [existe] = await db.query(
        "SELECT id FROM categorias WHERE nome = ?",
        [nome]
      );

      if (existe.length === 0) {
        const [r] = await db.execute(
          "INSERT INTO categorias (nome) VALUES (?)",
          [nome]
        );
        if (!catId) catId = r.insertId; // salva a primeira categoria como padrão
      } else {
        if (!catId) catId = existe[0].id;
      }
    }

    // insert admin user if not exists
    const [users] = await db.query("SELECT id FROM usuarios WHERE email = ?", [
      "admin@example.com",
    ]);
    let userId;
    if (users.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      const [r] = await db.execute(
        "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
        ["Administrador", "admin@example.com", hash, "admin"]
      );
      userId = r.insertId;
    } else {
      userId = users[0].id;
    }

    // insert sample noticia
    const [n] = await db.query("SELECT id FROM noticias LIMIT 1");
    if (n.length === 0) {
      await db.execute(
        "INSERT INTO noticias (titulo, conteudo, id_categoria, id_autor) VALUES (?, ?, ?, ?)",
        [
          "Bem-vindo ao Portal",
          "Este é um exemplo de notícia criado pelo seed script.",
          catId,
          userId,
        ]
      );
    }

    console.log("Seed completo. Usuário admin: admin@example.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("Erro no seed:", err);
    process.exit(1);
  }
}

run();
