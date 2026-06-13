const router = require('express').Router();
const rankingTurmasController = require('../controllers/rankingTurmasController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.get('/', rankingTurmasController.obterRanking);
router.post('/atualizar', tokenMiddleware, rankingTurmasController.atualizar);
router.get('/melhor', rankingTurmasController.obterMelhorTurma);

module.exports = router;
