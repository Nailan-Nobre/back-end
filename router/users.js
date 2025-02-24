import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const userRouter = Router();
const prisma = new PrismaClient();

// Rota para buscar manicures
userRouter.get('/users/manicures', async (req, res) => {
  try {
    const manicures = await prisma.user.findMany({
      where: { tipo: "MANICURE" },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        estado: true,
        cidade: true,
        tipo: true,
      }
    });

    res.json(manicures);
  } catch (error) {
    console.error("Erro ao buscar manicures:", error);
    res.status(500).json({ error: 'Erro ao buscar manicures' });
  }
});

export default userRouter;
