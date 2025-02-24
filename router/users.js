import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const userRouter = Router();
const prisma = new PrismaClient();

// Rota para buscar todas as manicures
userRouter.get('/manicures', async (req, res) => {
  try {
    const manicures = await prisma.user.findMany({
      where: { tipo: "MANICURE" }
    });

    res.json(manicures);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar manicures' });
  }
});

export default userRouter
