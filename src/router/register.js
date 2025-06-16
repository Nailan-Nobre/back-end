import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const registerRouter = Router();
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
  const token = jwt.sign({ 
    id: user.id,
    tipo: user.tipo // Adicionar tipo no token
  }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
  res.send({ 
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      tipo: user.tipo
    }, 
    token 
  });
}
});

// Rota de cadastro
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, telefone, estado, cidade, tipo } = req.body;

    if (!name || !email || !password || !telefone || !estado || !cidade) {
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário", error: error.message });
  }
});

export default registerRouter;