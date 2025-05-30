export function verificarPermissao(tipoPermitido) {
  return (req, res, next) => {
    if (req.user.tipo !== tipoPermitido) {
      return res.status(403).json({ error: 'Permissão negada.' });
    }
    next();
  };
}