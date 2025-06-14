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

  // Verifica se o ID do token corresponde ao ID solicitado
  if (req.userId !== Number(id)) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  try {
    const usuario = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { // Adicione select para não retornar dados sensíveis
        id: true,
        nome: true,
        email: true,
        foto: true,
        tipo: true,
        telefone: true,
        endereco: true,
      }
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