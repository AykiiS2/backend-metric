import rateLimit from 'express-rate-limit';

const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 15;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 100;

export const loginLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: `Muitas tentativas de login. Tente novamente em ${RATE_LIMIT_WINDOW} minutos.`
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW * 60 * 1000,
  max: RATE_LIMIT_MAX,
  message: {
    success: false,
    message: `Muitas requisições. Tente novamente em ${RATE_LIMIT_WINDOW} minutos.`
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const sensitiveOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Limite de operações excedido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
