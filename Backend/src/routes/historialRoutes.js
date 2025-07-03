const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { obtenerHistorial } = require('../controllers/historialController');

// Permitir solo guardias o admins (usa verifyToken)
router.get('/', verifyToken, obtenerHistorial);

module.exports = router;
