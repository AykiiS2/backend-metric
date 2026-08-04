import { Atividade } from '../models/Atividade.js';

const atividadeModel = new Atividade();

export const atividadeController = {
  async create(req, res, next) {
    try {
      const { salaId, atividade } = req.body;

      if (!salaId || !atividade) {
        return res.status(400).json({
          success: false,
          message: 'Sala ID e atividade são obrigatórios'
        });
      }

      const result = await atividadeModel.create({
        salaId,
        atividade
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async findBySala(req, res, next) {
    try {
      const { salaId } = req.params;
      const atividades = await atividadeModel.findBySala(salaId);
      res.status(200).json({
        success: true,
        data: atividades
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await atividadeModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Atividade deletada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
};
