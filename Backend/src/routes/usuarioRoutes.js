const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const logAction = require('../middleware/logAction');
const { registrarUsuario } = require('../controllers/usuarioController');

// Registrar entrada/salida usuario + equipos
router.post('/registro', verifyToken, logAction('REGISTRAR_USUARIO'), registrarUsuario);

module.exports = router;
