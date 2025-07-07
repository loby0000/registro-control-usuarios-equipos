const Log = require('../models/Log');

function logAction(accion) {
  return async (req, res, next) => {
    try {
      if (req.usuario) {
        await Log.create({
          accion,
          usuario: req.usuario.nombre || req.usuario.usuario || 'desconocido',
          rol: req.usuario.rol || 'desconocido',
          detalles: req.body
        });
      }
    } catch (err) {
      // No bloquear el flujo si falla el log
      console.error('Error guardando log:', err.message);
    }
    next();
  };
}

module.exports = logAction;
