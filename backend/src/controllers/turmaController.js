import { Turma } from '../models/Turma.js';

const turmaModel = new Turma();

export const turmaController = {
  async create(req, res, next) {
    try {
      const { nome_turma, periodo, nivel_ensino, serie, id_escola } = req.body;

      if (!nome_turma || !periodo || !nivel_ensino || !serie || !id_escola) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      const turma = await turmaModel.create({ nome_turma, periodo, nivel_ensino, serie, id_escola });
      res.status(201).json({
        success: true,
        data: turma
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const turmas = await turmaModel.findAll();
      res.status(200).json({
        success: true,
        data: turmas
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const turma = await turmaModel.findById(id);
      res.status(200).json({
        success: true,
        data: turma
      });
    } catch (error) {
      next(error);
    }
  },

  async findWithAlunos(req, res, next) {
    try {
      const { id } = req.params;
      const turma = await turmaModel.findWithAlunos(id);
      res.status(200).json({
        success: true,
        data: turma
      });
    } catch (error) {
      next(error);
    }
  },

  async findByEscola(req, res, next) {
    try {
      const { escolaId } = req.params;
      const turmas = await turmaModel.findByEscola(escolaId);
      res.status(200).json({
        success: true,
        data: turmas
      });
    } catch (error) {
      next(error);
    }
  },

  async getRanking(req, res, next) {
    try {
      const ranking = await turmaModel.getRanking();
      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome_turma, periodo, nivel_ensino, serie, id_escola } = req.body;

      if (!nome_turma || !periodo || !nivel_ensino || !serie || !id_escola) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      const turma = await turmaModel.update(id, { nome_turma, periodo, nivel_ensino, serie, id_escola });
      res.status(200).json({
        success: true,
        data: turma
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await turmaModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Turma deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      next(error);
    }
  }
};
