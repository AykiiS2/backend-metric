const router = require('express').Router();
const TurmaController = require('../controllers/turmaController');
const { validateTurma, validateIdParam } = require('../middlewares/validationMiddleware');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/', tokenMiddleware, validateTurma, TurmaController.create);
router.get('/', tokenMiddleware, TurmaController.getAll);
router.get('/:id/alunos', tokenMiddleware, validateIdParam, TurmaController.getAlunos);
router.get('/:id', tokenMiddleware, validateIdParam, TurmaController.getById);
router.put('/:id', tokenMiddleware, validateIdParam, validateTurma, TurmaController.update);
router.delete('/:id', tokenMiddleware, validateIdParam, TurmaController.delete);

module.exports = router;