import express from 'express';
import { salvarTabuada, listarTabuadas, buscarTabuadaPorId, atualizarTabuada, deletarTabuada } from '../controllers/tabuadaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, salvarTabuada);
router.get('/', auth, listarTabuadas);
router.get('/:id', auth, buscarTabuadaPorId);
router.put('/:id', auth, atualizarTabuada);
router.delete('/:id', auth, deletarTabuada);

export default router;
