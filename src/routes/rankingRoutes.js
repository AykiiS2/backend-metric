const router = require('express').Router();
const rankingController = require('../controllers/rankingController');

router.post('/atualizar', rankingController.atualizarRanking);
router.get('/obter', rankingController.obterRanking);
router.get('/posicao/:alunoId', rankingController.obterPosicaoAluno);

module.exports = router;
