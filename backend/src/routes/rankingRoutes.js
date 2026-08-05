import express from 'express';
import { rankingController } from '../controllers/rankingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/alunos', rankingController.getRankingAlunos);
router.get('/alunos/turma/:turmaId', rankingController.getRankingAlunosByTurma);
router.get('/turmas', rankingController.getRankingTurmas);
router.get('/escolas', rankingController.getRankingEscolas);

export default router;