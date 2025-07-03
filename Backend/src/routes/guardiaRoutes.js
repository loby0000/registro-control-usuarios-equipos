const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createGuardia } = require('../controllers/guardiaController');

// Crear guardia (protegido)
router.post('/create', verifyToken, createGuardia);

module.exports = router;
