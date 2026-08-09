import express from 'express';
import { salaController } from '../controllers/salaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, salaValidation } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(salaValidation.create), salaController.create);
router.get('/', salaController.findAll);
router.get('/ativas', salaController.findAtivas);
router.get('/disponiveis/:alunoId', salaController.getDisponiveisPorAluno);
router.get('/escola/:escolaId', salaController.findByEscola);
router.get('/turma/:turmaId', salaController.findByTurma);
router.get('/aluno/:alunoId', salaController.findByAluno);
router.get('/:id', salaController.findById);
router.get('/:id/atividade', salaController.getAtividade);
router.put('/:id', salaController.update);
router.put('/:id/abrir', salaController.abrir);
router.put('/:id/finalizar', salaController.finalizar);
router.delete('/:id', salaController.delete);

export default router;
