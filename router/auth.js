import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { uploadImagem } from "../router/supabase.js"; // A função de upload para o Supabase

const saltRounds = 10;
const authRouter = Router();
const prisma = new PrismaClient();

// Rota de login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("Email não cadastrado: ", email);
    return res.status(400).send("Usuário ou email inválidos");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (passwordIsValid) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    delete user.password;
    res.send({ user, token });
  } else {
    res.status(400).send("Usuário ou email inválidos");
  }
});

// Rota de cadastro
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, telefone, estado, cidade, tipo, fotoBase64 } = req.body;

    if (!name || !email || !password || !telefone || !estado || !cidade || !fotoBase64) {
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Enviar a imagem para o Supabase e obter a URL
    let fotoUrl = null;
    try {
      fotoUrl = await uploadImagem(fotoBase64, email); // Envia a imagem base64 e obtém a URL
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return res.status(500).json({ message: "Erro ao fazer upload da imagem" });
    }

    if (error) {
      console.error("Erro ao enviar imagem para o Supabase:", error);
      return res.status(500).json({ message: "Erro ao enviar imagem para o Supabase." });
    }
    
    console.log("URL da imagem enviada:", fotoUrl);  // Adicione este log para inspecionar o retorno
    
    // Criação do usuário no banco
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        telefone,
        estado,
        cidade,
        tipo: tipo.toUpperCase(),
        foto: fotoUrl,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
  }
});

export default authRouter;