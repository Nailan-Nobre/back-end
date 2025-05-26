import cors from 'cors';
import Express from 'express';
import logger from './middlewares/logger.js';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import verifyToken from './middlewares/verifyToken.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';
const app = Express()
app.use(cors())
app.use(Express.json())

app.get('/', (req, res) => {
  res.send("App online!")
})

app.use(logger)
app.use(authRouter)

app.use(userRouter)
app.use(verifyToken)

app.use(authMiddleware);

app.use('/agendamentos', agendamentoRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`app online na porta ${PORT}`)
});
