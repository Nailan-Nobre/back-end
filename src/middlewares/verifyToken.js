import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
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

    // ⚠️ Corrigido aqui
    req.user = decoded; // Isso inclui id, tipo e outros dados do token
    next();
  });
}

export default verifyToken;
