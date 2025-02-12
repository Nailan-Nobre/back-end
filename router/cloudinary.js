const express = require('express');
const upload = require('../midlewares/upload');
const prisma = require('../prisma');
const router = express.Router();

router.post('/upload', upload.single('foto'), async (req, res) => {
    try {
        const { email, name, password, telefone, estado, cidade, tipo } = req.body;
        const foto = req.file.path;

        const novoUsuario = await prisma.user.create({
            data: {
                email,
                name,
                password,
                telefone,
                foto,
                estado,
                cidade,
                tipo: tipo.toUpperCase() // Certifique-se de que o tipo está em maiúsculas para corresponder ao enum
            },
        });

        res.json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar a imagem" });
    }
});

module.exports = router;