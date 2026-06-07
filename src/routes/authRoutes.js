const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', (req, res) => authController.login(req, res));
router.get('/verificar-email/:email', (req, res) => authController.verificarEmail(req, res));

module.exports = router;