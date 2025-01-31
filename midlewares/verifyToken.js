import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
  console.log(token)
  if (!token) {
    return res.status(403).send({
      auth: false, message: 'Nenhum token fornecido.'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Falha ao autenticar. Error -> ' + err
      })
    }
    req.userId = decoded.id
    next()
  })
}

export default verifyToken