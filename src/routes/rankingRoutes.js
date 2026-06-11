const router = require('express').Router();
const rankingController = require('../controllers/rankingController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', tokenMiddleware, rankingController.atualizarRanking);
router.post('/historico', tokenMiddleware, rankingController.registrarHistorico);
router.get('/obter', rankingController.obterRanking);
router.get('/posicao/:alunoId', rankingController.obterPosicaoAluno);
