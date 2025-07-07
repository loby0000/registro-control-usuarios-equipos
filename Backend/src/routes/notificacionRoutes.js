const express = require('express');
const router = express.Router();
const Notificacion = require('../models/Notificacion');
const verifyToken = require('../middleware/verifyToken');

// Listar todas las notificaciones (solo admin)
router.get('/', verifyToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  const notificaciones = await Notificacion.find().sort({ fecha: -1 });
  res.json(notificaciones);
});

// Marcar como leída (solo admin)
router.put('/:id/leida', verifyToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  try {
    const noti = await Notificacion.findByIdAndUpdate(req.params.id, { leida: true }, { new: true });
    if (!noti) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json(noti);
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar como leída' });
  }
});

// Eliminar notificación (solo admin)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  try {
    const noti = await Notificacion.findByIdAndDelete(req.params.id);
    if (!noti) return res.status(404).json({ message: 'Notificación no encontrada' });
    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar notificación' });
  }
});

module.exports = router;
