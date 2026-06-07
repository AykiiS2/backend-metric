const router = require('express').Router();
const rankingController = require('../controllers/rankingController');
const { authMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', authMiddleware, rankingController.atualizarRanking);
router.post('/historico', authMiddleware, rankingController.registrarHistorico);
router.get('/obter', rankingController.obterRanking);
router.get('/posicao/:alunoId', rankingController.obterPosicaoAluno);

module.exports = router;
