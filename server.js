import express from 'express';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import http from 'http';

import { securityHeaders, corsConfig } from './backend/src/middleware/security.js';
import { generalLimiter } from './backend/src/middleware/rateLimiter.js';
import { sanitizeRequestBody } from './backend/src/utils/sanitizer.js';
import authRoutes from './backend/src/routes/authRoutes.js';
import escolaRoutes from './backend/src/routes/escolaRoutes.js';
import turmaRoutes from './backend/src/routes/turmaRoutes.js';
import alunoRoutes from './backend/src/routes/alunoRoutes.js';
import rankingRoutes from './backend/src/routes/rankingRoutes.js';
import lobbyRoutes from './backend/src/routes/lobbyRoutes.js';
import salaRoutes from './backend/src/routes/salaRoutes.js';
import { errorHandler } from './backend/src/utils/errors.js';
import tabuadaRoutes from './backend/src/routes/tabuadaRoutes.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(securityHeaders);
app.use(corsConfig);
app.options('*', corsConfig);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequestBody);
app.use('/api', generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/lobby', lobbyRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/tabuadas', tabuadaRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const clients = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const salaId = url.searchParams.get('salaId');
  
  if (salaId) {
    if (!clients.has(salaId)) {
      clients.set(salaId, []);
    }
    clients.get(salaId).push(ws);
    
    ws.on('close', () => {
      const salaClients = clients.get(salaId);
      if (salaClients) {
        const index = salaClients.indexOf(ws);
        if (index !== -1) {
          salaClients.splice(index, 1);
        }
        if (salaClients.length === 0) {
          clients.delete(salaId);
        }
      }
    });
  }
});

export const broadcastToSala = (salaId, data) => {
  const salaClients = clients.get(salaId);
  if (salaClients) {
    const message = JSON.stringify(data);
    salaClients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }
};

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
