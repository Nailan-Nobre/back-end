import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';

const userRouter = Router();
const prisma = new PrismaClient();

// Middleware para checar tipo de usuário
function permitirTipos(...tipos) {
  return (req, res, next) => {
    if (!req.user || !tipos.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Permissão negada.' });
    }
    next();
  };
}

// Buscar todas as manicures (acesso público)
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

// Buscar manicure por ID (acesso público)
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

// Buscar qualquer usuário por ID (apenas o próprio usuário ou admin)
userRouter.get('/usuario/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  // Só permite se for o próprio usuário ou admin
  if (req.user.id !== Number(id) && req.user.tipo !== 'ADMIN') {
    return res.status(403).json({ error: 'Permissão negada.' });
  }
  try {
    const usuario = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        telefone: true,
        estado: true,
        cidade: true,
        tipo: true,
        foto: true
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// Exemplo de rota exclusiva para CLIENTE
userRouter.get('/cliente-area', verifyToken, permitirTipos('CLIENTE'), (req, res) => {
  res.json({ message: 'Bem-vindo à área do cliente!😊' });
});

// Exemplo de rota exclusiva para MANICURE
userRouter.get('/manicure-area', verifyToken, permitirTipos('MANICURE'), (req, res) => {
  res.json({ message: 'Bem-vindo à área da manicure!😊' });
});

export default userRouter;