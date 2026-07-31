import express from 'express';
import { turmaController } from '../controllers/turmaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, turmaValidation } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(turmaValidation.create), turmaController.create);
router.get('/', turmaController.findAll);
router.get('/escola/:escolaId', turmaController.findByEscola);
router.get('/:id', turmaController.findById);
router.get('/:id/alunos', turmaController.findWithAlunos);
router.put('/:id', validate(turmaValidation.update), turmaController.update);
router.delete('/:id', turmaController.delete);

export default router;
