import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const userRouter = Router();
const prisma = new PrismaClient();

// Rota para obter um usuário por ID
userRouter.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Rota para obter todos os usuários do tipo "MANICURE"
userRouter.get('/users', async (req, res) => {
  const { tipo, estado, cidade } = req.query;
  try {
    let users = await prisma.user.findMany({
      where: { tipo },
    });

    if (estado) {
      users = users.filter(user => user.estado === estado);
    }

    if (cidade) {
      users = users.filter(user => user.cidade === cidade);
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

export default userRouter;
