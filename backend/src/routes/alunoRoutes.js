import express from 'express';
import { alunoController } from '../controllers/alunoController.js';
import { authenticateToken, isProfessor, isAluno, isOwnProfile } from '../middleware/auth.js';
import { validate, alunoValidation } from '../middleware/validation.js';
import { sensitiveOperationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', alunoController.login);

router.use(authenticateToken);

router.post('/', isProfessor, sensitiveOperationLimiter, validate(alunoValidation.create), alunoController.create);
router.get('/', isProfessor, alunoController.findAll);
router.get('/escola/:escolaId', isProfessor, alunoController.findByEscola);
router.get('/turma/:turmaId', isProfessor, alunoController.findByTurma);
router.get('/rm/:rm', isProfessor, alunoController.findByRM);
router.get('/:id', isAluno, isOwnProfile, alunoController.findById);
router.put('/:id', isAluno, isOwnProfile, validate(alunoValidation.update), alunoController.update);
router.put('/:id/senha', isAluno, isOwnProfile, validate(alunoValidation.updatePassword), alunoController.updatePassword);
router.delete('/:id', isProfessor, sensitiveOperationLimiter, alunoController.delete);

export default router;
