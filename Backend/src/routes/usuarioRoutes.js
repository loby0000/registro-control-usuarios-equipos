const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { registrarUsuario } = require('../controllers/usuarioController');

// Registrar entrada/salida usuario + equipos
router.post('/registro', verifyToken, registrarUsuario);

module.exports = router;
