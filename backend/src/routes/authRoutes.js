import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, loginValidation } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/login/professor', loginLimiter, validate(loginValidation), authController.loginProfessor);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logoutProfessor);
router.get('/verify', authenticateToken, authController.verifyToken);

export default router;
