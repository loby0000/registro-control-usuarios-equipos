const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');
const verifyToken = require('../middleware/verifyToken');

// Solo admin puede consultar notificaciones
router.get('/', verifyToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  const notificaciones = await Notificacion.find().sort({ fecha: -1 });
  res.json(notificaciones);
});

module.exports = router;
