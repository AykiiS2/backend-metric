const router = require('express').Router();
const AlunoController = require('../controllers/alunoController');
const { validateAluno, validateIdParam } = require('../middlewares/validationMiddleware');
const { tokenMiddleware } = require('../middlewares/tokenMiddleware');

router.post('/', tokenMiddleware, validateAluno, AlunoController.create);
router.get('/', tokenMiddleware, AlunoController.getAll);
router.get('/turma/:id_turma', tokenMiddleware, validateIdParam, AlunoController.getByTurma);
router.get('/:id', tokenMiddleware, validateIdParam, AlunoController.getById);
router.put('/:id', tokenMiddleware, validateIdParam, validateAluno, AlunoController.update);
router.delete('/:id', tokenMiddleware, validateIdParam, AlunoController.delete);

module.exports = router;