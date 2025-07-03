const express = require('express');
const router = express.Router();

const { loginAdmin } = require('../controllers/authController');

// Ruta POST para login
router.post('/login', loginAdmin);

module.exports = router;
