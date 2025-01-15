const express = require('express');
const prisma = require('@prisma/client').PrismaClient;
const app = express();
app.use(express.json());

const prismaClient = new prisma();

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar se os campos necessários estão presentes
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    // Busca o usuário pelo email
    const usuario = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    });

    // Verifica se o usuário foi encontrado e se a senha está correta
    if (usuario && usuario.password === password) {
      // Login bem-sucedido: retorna os dados necessários
      res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
        }
      });
    } else {
      // Credenciais inválidas
      res.status(401).json({ message: 'Email ou senha incorretos.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});
