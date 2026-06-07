const router = require('express').Router();
const rankingController = require('../controllers/rankingController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', tokenMiddleware, rankingController.atualizarRanking);
router.get('/obter', tokenMiddleware, rankingController.obterRanking);
router.get('/posicao/:alunoId', tokenMiddleware, rankingController.obterPosicaoAluno);

module.exports = router;
