import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import http from 'http';

import authRoutes from './backend/src/routes/authRoutes.js';
import escolaRoutes from './backend/src/routes/escolaRoutes.js';
import turmaRoutes from './backend/src/routes/turmaRoutes.js';
import alunoRoutes from './backend/src/routes/alunoRoutes.js';
import rankingRoutes from './backend/src/routes/rankingRoutes.js';
import lobbyRoutes from './backend/src/routes/lobbyRoutes.js';
import salaRoutes from './backend/src/routes/salaRoutes.js';
import atividadeRoutes from './backend/src/routes/atividadeRoutes.js';
import { errorHandler } from './backend/src/utils/errors.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:60520', 'http://localhost:3000', 'https://backend-metric.onrender.com'];

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
}));

app.options('*', cors());

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/lobby', lobbyRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/atividades', atividadeRoutes);

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
