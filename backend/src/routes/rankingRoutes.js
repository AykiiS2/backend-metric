import express from 'express';

import {
  rankingController
} from '../controllers/rankingController.js';

import {
  authenticateToken,
  requireRole
} from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get(
  '/alunos/seguro',
  requireRole(['aluno']),
  rankingController.getSafeRankingAlunos
);

router.get(
  '/alunos/seguro/turma/:turmaId',
  requireRole(['aluno']),
  rankingController.getSafeRankingAlunosByTurma
);

router.get(
  '/alunos',
  requireRole(['professor']),
  rankingController.getRankingAlunos
);

router.get(
  '/alunos/turma/:turmaId',
  requireRole(['professor']),
  rankingController.getRankingAlunosByTurma
);

router.get(
  '/alunos/escola/:escolaId',
  rankingController.getRankingAlunosByEscola
);


router.get(
  '/turmas/opcoes',
  rankingController.getTurmaOptions
);

router.get(
  '/turmas',
  rankingController.getRankingTurmas
);


router.get(
  '/turmas/escola/:escolaId',
  rankingController.getRankingTurmasByEscola
);

router.get(
  '/escolas/classificacao',
  rankingController.getSafeRankingEscolas
);

router.get(
  '/escolas',
  rankingController.getRankingEscolas
);

export default router;
