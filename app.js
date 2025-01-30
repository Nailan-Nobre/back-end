import cors from 'cors';
import Express from 'express';
import logger from './midlewares/logger.js';
import userRouter from './router/users.js';
import authRouter from './router/auth.js';
import verifyToken from './midlewares/verifyToken.js';
const app = Express()
app.use(cors())
app.use(Express.json())

app.get('/', (req, res) => {
  res.send("App online!")
})

app.use(logger)
app.use(authRouter)

app.use(verifyToken)
app.use(userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`app online na porta ${PORT}`)
});