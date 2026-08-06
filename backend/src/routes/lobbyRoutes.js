import express from 'express';
import { LobbySala } from '../models/LobbySala.js';
import { LogEntrada } from '../models/LogEntrada.js';
import { LogResultado } from '../models/LogResultado.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, salaValidation, logValidation } from '../middleware/validation.js';

const router = express.Router();
const salaModel = new LobbySala();
const logEntradaModel = new LogEntrada();
const logResultadoModel = new LogResultado();

router.use(authenticateToken);

router.post('/salas', validate(salaValidation.create), async (req, res, next) => {
  try {
    const sala = await salaModel.create(req.body);
    res.status(201).json({
      success: true,
      data: sala
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas', async (req, res, next) => {
  try {
    const salas = await salaModel.findAll();
    res.status(200).json({
      success: true,
      data: salas
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/ativas', async (req, res, next) => {
  try {
    const salas = await salaModel.getSalasAtivas();
    res.status(200).json({
      success: true,
      data: salas
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/escola/:escolaId', async (req, res, next) => {
  try {
    const { escolaId } = req.params;
    const salas = await salaModel.findByEscola(escolaId);
    res.status(200).json({
      success: true,
      data: salas
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/turma/:turmaId', async (req, res, next) => {
  try {
    const { turmaId } = req.params;
    const salas = await salaModel.findByTurma(turmaId);
    res.status(200).json({
      success: true,
      data: salas
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/aluno/:alunoId', async (req, res, next) => {
  try {
    const { alunoId } = req.params;
    const salas = await salaModel.findByAluno(alunoId);
    res.status(200).json({
      success: true,
      data: salas
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/codigo/:codigo', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const sala = await salaModel.findByCodigo(codigo);
    res.status(200).json({
      success: true,
      data: sala
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sala = await salaModel.findById(id);
    res.status(200).json({
      success: true,
      data: sala
    });
  } catch (error) {
    next(error);
  }
});

router.get('/salas/:id/alunos', async (req, res, next) => {
  try {
    const { id } = req.params;
    const alunos = await logEntradaModel.getAlunosNaSala(id);
    res.status(200).json({
      success: true,
      data: alunos
    });
  } catch (error) {
    next(error);
  }
});

router.put('/salas/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sala = await salaModel.updateStatus(id, status);
    res.status(200).json({
      success: true,
      data: sala
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/salas/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await salaModel.delete(id);
    res.status(200).json({
      success: true,
      message: 'Sala deletada com sucesso'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/entrada', validate(logValidation.entrada), async (req, res, next) => {
  try {
    const { id_sala, id_aluno } = req.body;
    const log = await logEntradaModel.registrarEntrada(id_sala, id_aluno);
    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
});

router.post('/saida', validate(logValidation.entrada), async (req, res, next) => {
  try {
    const { id_sala, id_aluno } = req.body;
    const log = await logEntradaModel.registrarSaida(id_sala, id_aluno);
    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    next(error);
  }
});

router.get('/entrada/sala/:salaId', async (req, res, next) => {
  try {
    const { salaId } = req.params;
    const logs = await logEntradaModel.getAlunosNaSala(salaId);
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
});

router.get('/entrada/aluno/:alunoId', async (req, res, next) => {
  try {
    const { alunoId } = req.params;
    const historico = await logEntradaModel.getHistoricoAluno(alunoId);
    res.status(200).json({
      success: true,
      data: historico
    });
  } catch (error) {
    next(error);
  }
});

router.get('/entrada/sala/:salaId/estatisticas', async (req, res, next) => {
  try {
    const { salaId } = req.params;
    const stats = await logEntradaModel.getEstatisticasSala(salaId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

router.post('/resultados', validate(logValidation.resultado), async (req, res, next) => {
  try {
    const resultado = await logResultadoModel.create(req.body);
    res.status(201).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    next(error);
  }
});

router.get('/resultados/aluno/:alunoId', async (req, res, next) => {
  try {
    const { alunoId } = req.params;
    const resultados = await logResultadoModel.findByAluno(alunoId);
    res.status(200).json({
      success: true,
      data: resultados
    });
  } catch (error) {
    next(error);
  }
});

router.get('/resultados/sala/:salaId', async (req, res, next) => {
  try {
    const { salaId } = req.params;
    const resultados = await logResultadoModel.findBySala(salaId);
    res.status(200).json({
      success: true,
      data: resultados
    });
  } catch (error) {
    next(error);
  }
});

router.get('/resultados/aluno/:alunoId/estatisticas', async (req, res, next) => {
  try {
    const { alunoId } = req.params;
    const stats = await logResultadoModel.getEstatisticasAluno(alunoId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

router.get('/resultados/sala/:salaId/estatisticas', async (req, res, next) => {
  try {
    const { salaId } = req.params;
    const stats = await logResultadoModel.getEstatisticasSala(salaId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;
