const express = require('express');
const router = express.Router();
const { exportarHistorialExcel } = require('../controllers/exportHistorialController');
const verifyToken = require('../middleware/verifyToken');

router.get('/excel', verifyToken, exportarHistorialExcel);

module.exports = router;
