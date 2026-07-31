import express from 'express';
import { alunoController } from '../controllers/alunoController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, alunoValidation } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(alunoValidation.create), alunoController.create);
router.get('/', alunoController.findAll);
router.get('/escola/:escolaId', alunoController.findByEscola);
router.get('/turma/:turmaId', alunoController.findByTurma);
router.get('/rm/:rm', alunoController.findByRM);
router.get('/:id', alunoController.findById);
router.put('/:id', validate(alunoValidation.update), alunoController.update);
router.put('/:id/senha', alunoController.updatePassword);
router.delete('/:id', alunoController.delete);

export default router;
