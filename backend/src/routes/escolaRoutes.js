const router = require('express').Router();
const EscolaController = require('../controllers/escolaController');
const { validateEscola, validateIdParam } = require('../middlewares/validationMiddleware');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/', tokenMiddleware, validateEscola, EscolaController.create);
router.get('/', tokenMiddleware, EscolaController.getAll);
router.get('/:id/turmas', tokenMiddleware, validateIdParam, EscolaController.getTurmas);
router.get('/:id/alunos', tokenMiddleware, validateIdParam, EscolaController.getAlunos);
router.get('/:id', tokenMiddleware, validateIdParam, EscolaController.getById);
router.put('/:id', tokenMiddleware, validateIdParam, validateEscola, EscolaController.update);
router.delete('/:id', tokenMiddleware, validateIdParam, EscolaController.delete);

module.exports = router;