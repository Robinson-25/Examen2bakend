const jwt = require('jsonwebtoken');

// Verifica el token enviado en la cabecera "Authorization: Bearer <token>"
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No se envió el token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, roles: payload.roles || [] };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Permite el acceso solo si el usuario tiene alguno de los roles indicados
const hasRole = (...allowed) => (req, res, next) => {
  if (req.user.roles.some((r) => allowed.includes(r))) return next();
  res.status(403).json({ message: `Requiere rol: ${allowed.join(' o ')}` });
};

module.exports = { verifyToken, hasRole };
