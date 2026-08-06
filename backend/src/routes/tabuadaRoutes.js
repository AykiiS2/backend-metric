const express = require('express');
const router = express.Router();
const tabuadaController = require('../controllers/tabuadaController');
const auth = require('../middleware/auth');

router.post('/', auth, tabuadaController.salvarTabuada);
router.get('/', auth, tabuadaController.listarTabuadas);
router.get('/:id', auth, tabuadaController.buscarTabuadaPorId);
router.put('/:id', auth, tabuadaController.atualizarTabuada);
router.delete('/:id', auth, tabuadaController.deletarTabuada);

module.exports = router;
