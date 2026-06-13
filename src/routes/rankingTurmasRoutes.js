const router = require('express').Router();
const rankingTurmasController = require('../controllers/rankingTurmasController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', tokenMiddleware, rankingTurmasController.atualizar);
router.get('/obter', tokenMiddleware, rankingTurmasController.obterRanking);
router.get('/melhor', tokenMiddleware, rankingTurmasController.obterMelhorTurma);

module.exports = router;
