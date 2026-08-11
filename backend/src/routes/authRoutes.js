import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken, authenticateAluno } from '../middleware/auth.js';
import { validate, loginValidation, alunoLoginValidation } from '../middleware/validation.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login/professor', loginLimiter, validate(loginValidation), authController.loginProfessor);
router.post('/login/aluno', loginLimiter, validate(alunoLoginValidation), authenticateAluno, authController.loginAluno);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logoutProfessor);
router.post('/logout/aluno', authenticateToken, authController.logoutAluno);
router.get('/verify', authenticateToken, authController.verifyToken);

export default router;
