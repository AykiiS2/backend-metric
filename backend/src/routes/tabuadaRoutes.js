const express = require('express');
const router = express.Router();
const {
    avaliarTabuada,
    getInfoNivel,
    iniciarSessao,
    finalizarSessao
} = require('../controllers/tabuadaController');

router.post('/avaliar', avaliarTabuada);
router.get('/info/:nivel', getInfoNivel);
router.post('/sessao/iniciar', iniciarSessao);
router.post('/sessao/finalizar', finalizarSessao);

module.exports = router;