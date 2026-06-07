const router = require('express').Router();
const distribuicaoNotasController = require('../controllers/DistribuicaoNotasController');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/registrar', tokenMiddleware, distribuicaoNotasController.registrar);
router.get('/obter', tokenMiddleware, distribuicaoNotasController.obterDistribuicao);

module.exports = router;
