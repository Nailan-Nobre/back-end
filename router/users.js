import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const userRouter = Router();
const prisma = new PrismaClient();

// Rota para buscar todas as manicures
userRouter.get('/manicures', async (req, res) => {
  console.log('Buscando manicures');
  try {
    const manicures = await prisma.user.findMany({
      where: { tipo: 'MANICURE' },
    });
    console.log( manicures)
    res.json(manicures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar manicures' });
  }
});

export default userRouter
