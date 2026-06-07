const router = require('express').Router();
const rankingEscolasController = require('../controllers/rankingEscolasController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/atualizar', tokenMiddleware, rankingEscolasController.atualizar);
router.get('/obter', tokenMiddleware, rankingEscolasController.obterRanking);

module.exports = router;
