const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { exportarHistorialExcel } = require('../controllers/exportHistorialController');

// Ruta protegida (admin o guardia)
router.get('/excel', verifyToken, exportarHistorialExcel);

module.exports = router;
