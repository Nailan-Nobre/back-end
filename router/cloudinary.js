const express = require("express");
const upload = require("../middlewares/upload");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Erro ao fazer upload da imagem" });
    }

    const { email, name, password, telefone, estado, cidade, tipo } = req.body;
    const foto = req.file.path; // URL do Cloudinary

    const novoUsuario = await prisma.user.create({
      data: {
        email,
        name,
        password,
        telefone,
        foto,
        estado,
        cidade,
        tipo: tipo.toUpperCase(),
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao salvar usuário com imagem:", error);
    res.status(500).json({ error: "Erro ao salvar usuário com imagem" });
  }
});

module.exports = router;