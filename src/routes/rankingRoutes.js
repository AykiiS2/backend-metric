const router = require('express').Router();
const rankingController = require('../controllers/rankingController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.get('/', rankingController.obterRanking);
router.post('/atualizar', tokenMiddleware, rankingController.atualizarRanking);
router.get('/posicao/:alunoId', rankingController.obterPosicaoAluno);

module.exports = router;
