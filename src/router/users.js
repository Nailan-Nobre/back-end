import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const userRouter = Router();
const prisma = new PrismaClient();

// Buscar todas as manicures
userRouter.get('/manicures', async (req, res) => {
  try {
    const manicures = await prisma.user.findMany({
      where: { tipo: 'MANICURE' },
    });
    res.json(manicures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar manicures' });
  }
});

// Buscar manicure por ID
userRouter.get('/manicures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const manicure = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!manicure || manicure.tipo !== 'MANICURE') {
      return res.status(404).json({ error: 'Manicure não encontrada' });
    }

    res.json(manicure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar manicure' });
  }
});

// Buscar qualquer usuário por ID
userRouter.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default userRouter;