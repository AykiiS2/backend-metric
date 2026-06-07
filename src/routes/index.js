const express = require('express');
const router = express.Router();

const escolasRoutes = require('./escolaRoutes');
const turmasRoutes = require('./turmaRoutes');
const alunosRoutes = require('./alunoRoutes');
const authRoutes = require('./authRoutes');
const rankingRoutes = require('./rankingRoutes');
const distribuicaoNotasRoutes = require('./distribuicaoNotasRoutes');

router.use('/escolas', escolasRoutes);
router.use('/turmas', turmasRoutes);
router.use('/alunos', alunosRoutes);
router.use('/auth', authRoutes);
router.use('/ranking', rankingRoutes);
router.use('/distribuicao-notas', distribuicaoNotasRoutes);

module.exports = router;
