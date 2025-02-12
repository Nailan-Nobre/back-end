const express = require('express');
const upload = require('../midlewares/upload');
const prisma = require('../prisma');
const router = express.Router();

import upload from '../midlewares/upload.js';

router.post('/upload', upload.single('foto'), async (req, res) => {
    try {
        console.log("Arquivo recebido:", req.file);
        console.log("Dados recebidos:", req.body);

        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
        }

        const { email, name, password, telefone, estado, cidade, tipo } = req.body;
        const foto = req.file.path; // URL da imagem no Cloudinary

        const novoUsuario = await prisma.user.create({
            data: {
                email,
                name,
                password,
                telefone,
                foto,
                estado,
                cidade,
                tipo: tipo.toUpperCase()
            },
        });

        res.json(novoUsuario);
    } catch (error) {
        console.error('Erro ao salvar a imagem:', error);
        res.status(500).json({ error: "Erro ao salvar a imagem" });
    }
});