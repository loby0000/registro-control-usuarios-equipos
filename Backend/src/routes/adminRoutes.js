const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createAdmin } = require('../controllers/adminController');

// Proteger la ruta con middleware verifyToken
router.post('/create', verifyToken, createAdmin);

module.exports = router;
