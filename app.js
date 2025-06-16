import cors from 'cors';
import Express from 'express';
import logger from './src/middlewares/logger.js';
import userRouter from './src/router/users.js';
import registerRouter from './src/router/register.js';
import verifyToken from './src/middlewares/verifyToken.js';
import agendamentoRoutes from './src/router/agendamento.js';
import googleAuthRouter from './src/router/google.js';

const app = Express();
const corsOptions = {
  origin: [
     'https://ifpi-picos.github.io',
    'https://back-end-u9vj.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
};
app.use(cors(corsOptions));

app.use(Express.json());

// Middleware de logging
app.use(logger);

// Rota pública
app.get('/', (req, res) => {
  res.send("App online!");
});

// Rotas de autenticação (não requerem token)
app.use(registerRouter);
app.use('/', googleAuthRouter);

// Middleware de autenticação
app.use(verifyToken);

// Rotas protegidas
app.use(userRouter);
app.use('/', agendamentoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app online na porta ${PORT}`);
});