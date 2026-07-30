import { Aluno } from '../models/Aluno.js';
import { AppError } from '../utils/errors.js';

const alunoModel = new Aluno();

export const alunoController = {
  async create(req, res, next) {
    try {
      const aluno = await alunoModel.create(req.body);
      res.status(201).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const alunos = await alunoModel.findAll();
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const aluno = await alunoModel.findById(id);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findByRM(req, res, next) {
    try {
      const { rm } = req.params;
      const aluno = await alunoModel.findByRM(rm);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findByEscola(req, res, next) {
    try {
      const { escolaId } = req.params;
      const alunos = await alunoModel.findByEscola(escolaId);
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async findByTurma(req, res, next) {
    try {
      const { turmaId } = req.params;
      const alunos = await alunoModel.findByTurma(turmaId);
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async getRanking(req, res, next) {
    try {
      const ranking = await alunoModel.getRanking();
      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getRankingByTurma(req, res, next) {
    try {
      const { turmaId } = req.params;
      const ranking = await alunoModel.getRankingByTurma(turmaId);
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
      const aluno = await alunoModel.update(id, req.body);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await alunoModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Aluno deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { senha } = req.body;
      
      if (!senha || senha.length < 6) {
        throw new AppError('Senha deve ter no mínimo 6 caracteres', 400);
      }

      const aluno = await alunoModel.updatePassword(id, senha);
      res.status(200).json({
        success: true,
        message: 'Senha atualizada com sucesso',
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  }
};