import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('email não cadastrado: ', email);
    return res.status(400).send('Usuário ou email inválidos');
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (passwordIsValid) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    delete user.password;
    res.send({ user, token });
  } else {
    res.status(400).send('Usuário ou email inválidos');
  }
});

authRouter.post('/signup', async (req, res) => {
  const { name, email, password, telefone, foto, estado, cidade, tipo } = req.body;

  if (!name || !email || !password || !telefone || !estado || !cidade || !tipo) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        telefone,
        foto,
        estado,
        cidade,
        tipo: tipo.toUpperCase(), // Certifique-se de que o tipo está em maiúsculas para corresponder ao enum
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

export default authRouter;