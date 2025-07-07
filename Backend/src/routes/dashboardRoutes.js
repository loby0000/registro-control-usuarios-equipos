const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/verifyToken');

// Solo admin puede consultar el dashboard
router.get('/resumen', verifyToken, (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo admin' });
  }
  next();
}, dashboardController.getResumen);

module.exports = router;
