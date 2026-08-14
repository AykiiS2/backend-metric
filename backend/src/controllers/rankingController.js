import { Aluno } from '../models/Aluno.js';
import { Turma } from '../models/Turma.js';
import { Escola } from '../models/Escola.js';
import { rankingService } from '../services/rankingService.js';

const alunoModel = new Aluno();
const turmaModel = new Turma();
const escolaModel = new Escola();

export const rankingController = {
  async getRankingAlunos(
    req,
    res,
    next
  ) {
    try {
      const ranking =
        await alunoModel.getRanking();

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getRankingAlunosByTurma(
    req,
    res,
    next
  ) {
    try {
      const { turmaId } =
        req.params;

      const ranking =
        await alunoModel
          .getRankingByTurma(
            turmaId
          );

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getSafeRankingAlunos(
    req,
    res,
    next
  ) {
    try {
      const ranking =
        await rankingService
          .getSafeGeneralStudentRanking(
            req.user.id
          );

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getSafeRankingAlunosByTurma(
    req,
    res,
    next
  ) {
    try {
      const { turmaId } =
        req.params;

      const ranking =
        await rankingService
          .getSafeClassStudentRanking(
            req.user.id,
            turmaId
          );

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getRankingTurmas(
    req,
    res,
    next
  ) {
    try {
      const ranking =
        await turmaModel.getRanking();

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getTurmaOptions(
    req,
    res,
    next
  ) {
    try {
      const turmas =
        await rankingService
          .getTurmaOptions();

      res.status(200).json({
        success: true,
        data: turmas
      });
    } catch (error) {
      next(error);
    }
  },

  async getRankingEscolas(
    req,
    res,
    next
  ) {
    try {
      const ranking =
        await escolaModel
          .findAllWithStats();

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getSafeRankingEscolas(
    req,
    res,
    next
  ) {
    try {
      const ranking =
        await rankingService
          .getSchoolRanking();

      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  }
};
