const express = require('express');
const router = express.Router();
const { loginGuardia } = require('../controllers/guardiaAuthController');

router.post('/login', loginGuardia);

module.exports = router;
