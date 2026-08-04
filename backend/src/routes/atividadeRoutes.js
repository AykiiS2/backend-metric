import express from 'express';
import { atividadeController } from '../controllers/atividadeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', atividadeController.create);
router.get('/sala/:salaId', atividadeController.findBySala);
router.delete('/:id', atividadeController.delete);

export default router;
