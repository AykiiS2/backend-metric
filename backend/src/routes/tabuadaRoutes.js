import express from 'express';
import { salvarTabuada, listarTabuadas, buscarTabuadaPorId, atualizarTabuada, deletarTabuada } from '../controllers/tabuadaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, salvarTabuada);
router.get('/', authenticateToken, listarTabuadas);
router.get('/:id', authenticateToken, buscarTabuadaPorId);
router.put('/:id', authenticateToken, atualizarTabuada);
router.delete('/:id', authenticateToken, deletarTabuada);

export default router;
