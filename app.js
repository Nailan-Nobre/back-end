import cors from 'cors';
import Express from 'express';
import verifyToken from 'src/middlewares/verifyToken.js';
import logger from 'src/middlewares/logger.js';
import userRouter from 'src/routes/users.js';
import authRouter from 'src/routes/auth.js';
import agendamentoRoutes from 'src/routes/agendamentoRoutes.js';
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
