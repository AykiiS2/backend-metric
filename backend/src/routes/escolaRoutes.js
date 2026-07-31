import express from 'express';
import { escolaController } from '../controllers/escolaController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, escolaValidation } from '../middleware/validation.js';

const router = express.Router();

console.log('🔍 [ROUTES] Inicializando rotas de escolas');

router.use((req, res, next) => {
  console.log('🔍 [ROUTES] Requisição recebida:');
  console.log('  - Método:', req.method);
  console.log('  - URL:', req.url);
  console.log('  - Headers Authorization:', req.headers.authorization ? '✅ Presente' : '❌ Ausente');
  console.log('  - Body:', req.body);
  next();
});

router.use(authenticateToken);

console.log('🔍 [ROUTES] Middleware authenticateToken aplicado');

router.post('/', 
  validate(escolaValidation.create), 
  (req, res, next) => {
    console.log('🔍 [POST /escolas] Validado com sucesso');
    console.log('🔍 [POST /escolas] User ID:', req.userId);
    console.log('🔍 [POST /escolas] Teacher ID:', req.teacherId);
    console.log('🔍 [POST /escolas] Body recebido:', req.body);
    next();
  },
  escolaController.create
);

router.get('/', 
  (req, res, next) => {
    console.log('🔍 [GET /escolas] Buscando todas as escolas');
    next();
  },
  escolaController.findAll
);

router.get('/search', 
  (req, res, next) => {
    console.log('🔍 [GET /escolas/search] Buscando escolas por nome:', req.query.nome);
    next();
  },
  escolaController.search
);

router.get('/:id', 
  (req, res, next) => {
    console.log('🔍 [GET /escolas/:id] Buscando escola por ID:', req.params.id);
    next();
  },
  escolaController.findById
);

router.get('/:id/turmas', 
  (req, res, next) => {
    console.log('🔍 [GET /escolas/:id/turmas] Buscando turmas da escola:', req.params.id);
    next();
  },
  escolaController.findWithTurmas
);

router.put('/:id', 
  validate(escolaValidation.update), 
  (req, res, next) => {
    console.log('🔍 [PUT /escolas/:id] Atualizando escola:', req.params.id);
    console.log('🔍 [PUT /escolas/:id] Dados recebidos:', req.body);
    next();
  },
  escolaController.update
);

router.delete('/:id', 
  (req, res, next) => {
    console.log('🔍 [DELETE /escolas/:id] Deletando escola:', req.params.id);
    next();
  },
  escolaController.delete
);

console.log('✅ [ROUTES] Rotas de escolas configuradas com sucesso');

export default router;
