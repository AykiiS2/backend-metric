const router = require('express').Router();
const rankingEscolasController = require('../controllers/rankingEscolasController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.get('/', rankingEscolasController.obterRanking);
router.post('/atualizar', tokenMiddleware, rankingEscolasController.atualizar);
router.get('/melhor', rankingEscolasController.obterMelhorEscola);

module.exports = router;
