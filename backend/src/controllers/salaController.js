import { Sala } from '../models/Sala.js';

const salaModel = new Sala();

export const salaController = {
  async create(req, res, next) {
    try {
      const { nomeSala, idEscola, idTurma, idAluno, tabuada, modo, dataHora } = req.body;

      if (!nomeSala || !idEscola || !idTurma || !tabuada || !modo || !dataHora) {
        return res.status(400).json({
          success: false,
          message: 'Nome, escola, turma, tabuada, modo e data/hora são obrigatórios'
        });
      }

      const sala = await salaModel.create({
        nomeSala,
        idEscola,
        idTurma,
        idAluno: idAluno || null,
        tabuada,
        modo,
        dataHora
      });

      res.status(201).json({
        success: true,
        data: sala
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const salas = await salaModel.findAll();
      console.log('🔍 [SalaController] Total de salas:', salas.length);
      console.log('🔍 [SalaController] Primeira sala:', salas.length > 0 ? salas[0] : 'Nenhuma');
      console.log('🔍 [SalaController] Dados completos:', JSON.stringify(salas, null, 2));
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
      console.error('❌ [SalaController] Erro ao buscar salas:', error);
      next(error);
    }
  },

  async findById(req, res, next) {
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
  },

  async findByEscola(req, res, next) {
    try {
      const { escolaId } = req.params;
      const salas = await salaModel.findByEscola(escolaId);
      console.log('🔍 [SalaController] Salas da escola:', salas.length);
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
      next(error);
    }
  },

  async findByTurma(req, res, next) {
    try {
      const { turmaId } = req.params;
      const salas = await salaModel.findByTurma(turmaId);
      console.log('🔍 [SalaController] Salas da turma:', salas.length);
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
      next(error);
    }
  },

  async findByAluno(req, res, next) {
    try {
      const { alunoId } = req.params;
      const salas = await salaModel.findByAluno(alunoId);
      console.log('🔍 [SalaController] Salas do aluno:', salas.length);
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
      next(error);
    }
  },

  async findAtivas(req, res, next) {
    try {
      const salas = await salaModel.findAtivas();
      console.log('🔍 [SalaController] Salas ativas:', salas.length);
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const sala = await salaModel.update(id, updateData);
      res.status(200).json({
        success: true,
        data: sala
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await salaModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Sala deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar sala:', error);
      next(error);
    }
  },

  async finalizar(req, res, next) {
    try {
      const { id } = req.params;
      const sala = await salaModel.finalizar(id);
      res.status(200).json({
        success: true,
        message: 'Sala finalizada com sucesso',
        data: sala
      });
    } catch (error) {
      console.error('Erro ao finalizar sala:', error);
      next(error);
    }
  }
};
