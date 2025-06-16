import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token do Google ausente.' });

  try {
    // Verifica o token do Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Busca ou cria o usuário no banco
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          nome: payload.name,
          email: payload.email,
          tipo: 'CLIENTE', // padrão para login Google
          // Adicione outros campos se quiser
        }
      });
    }

    // Gera o JWT do seu sistema
    const jwtToken = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retorna o token e dados do usuário
    res.json({
      token: jwtToken,
      id: user.id,
      name: user.name,
      email: user.email,
      tipo: user.tipo
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token do Google inválido.' });
  }
});

export default router;