const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const logAction = require('../middleware/logAction');
const { createGuardia } = require('../controllers/guardiaController');

// Crear guardia (protegido)
router.post('/create', verifyToken, logAction('CREAR_GUARDIA'), createGuardia);

module.exports = router;
