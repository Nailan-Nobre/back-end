import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  // Permite requisições OPTIONS passar sem verificação
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      auth: false,
      message: 'Token ausente ou mal formatado.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        auth: false,
        message: 'Token inválido: ' + err.message,
      });
    }

    req.user = decoded;
    req.userId = decoded.id; // Adiciona userId explicitamente para fácil acesso
    next();
  });
}

export default verifyToken;