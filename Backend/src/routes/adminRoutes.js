const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const logAction = require('../middleware/logAction');

// 📌 Login de admin existente (NO requiere token)
router.post('/auth/login', adminController.loginAdmin);

// 📌 Crear NUEVO admin (requiere token admin)
router.post('/login', verifyToken, logAction('CREAR_ADMIN'), adminController.createAdmin);

module.exports = router;
