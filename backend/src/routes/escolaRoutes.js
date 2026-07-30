import express from 'express';
import { escolaController } from '../controllers/escolaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, escolaValidation } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(escolaValidation.create), escolaController.create);
router.get('/', escolaController.findAll);
router.get('/search', escolaController.search);
router.get('/:id', escolaController.findById);
router.get('/:id/turmas', escolaController.findWithTurmas);
router.put('/:id', validate(escolaValidation.update), escolaController.update);
router.delete('/:id', escolaController.delete);

export default router;