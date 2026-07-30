import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken, verifyTeacherCredentials, authenticateAluno } from '../middleware/auth.js';
import { validate, loginValidation, alunoLoginValidation } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/login/professor', loginLimiter, validate(loginValidation), verifyTeacherCredentials, authController.loginProfessor);
router.post('/login/aluno', loginLimiter, validate(alunoLoginValidation), authenticateAluno, authController.loginAluno);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logoutProfessor);
router.get('/verify', authenticateToken, authController.verifyToken);

export default router;