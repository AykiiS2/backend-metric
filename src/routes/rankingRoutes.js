const router = require('express').Router();
const rankingController = require('../controllers/rankingController');
const { tokenMiddleware: authMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', authMiddleware, rankingController.atualizarRanking);
router.get('/obter', rankingController.obterRanking);
router.get('/posicao/:alunoId', rankingController.obterPosicaoAluno);

module.exports = router;
