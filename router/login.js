const express = require('express');
const prisma = require('@prisma/client').PrismaClient;
const app = express();
app.use(express.json());

const prismaClient = new prisma();

// Rota de login
app.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário no banco de dados usando Prisma
    const usuario = await prismaClient.user.findUnique({
      where: {
        email: email // Busca o usuário pelo email
      }
    });

    // Verifica se o usuário foi encontrado e se a senha está correta
    if (usuario && usuario.password === password) {
      // Se for encontrado e a senha for correta, retorna os dados do usuário
      res.status(200).json({
        name: usuario.name,
        email: usuario.email
      });
    } else {
      // Se não for encontrado ou a senha estiver incorreta, retorna erro
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`app online na porta ${PORT}`)
});
