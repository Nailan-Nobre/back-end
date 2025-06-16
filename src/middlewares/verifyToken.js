import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
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
    console.error(`Token verification failed: ${err.message}`, { token });
    return res.status(401).json({
      auth: false,
      message: 'Token inválido ou expirado',
    });
    
  }
    req.user = {
    id: decoded.id,
    tipo: decoded.tipo // Garantir que o tipo está disponível
  };
    req.userId = decoded.id;
    next();
  });
}

export default verifyToken;