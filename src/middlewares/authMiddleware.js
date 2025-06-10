export function verificarPermissao(tipoPermitido) {
  return (req, res, next) => {
    if (!req.user || !req.user.tipo) {
      return res.status(401).json({ error: 'Usuário não autenticado ou token inválido.' });
    }

    if (req.user.tipo !== tipoPermitido) {
      return res.status(403).json({ error: 'Permissão negada.' });
    }

    next();
  };
}
