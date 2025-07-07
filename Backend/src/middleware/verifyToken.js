const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // <-- LOG PARA DEPURAR

    // Adjunta info bien estructurada y compatible con logs
    req.usuario = {
      id: decoded.id,
      usuario: decoded.usuario || decoded.nombre || 'desconocido',
      rol: decoded.rol || 'desconocido',
      nombre: decoded.nombre || null
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
