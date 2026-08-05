import { Escola } from '../models/Escola.js';

const escolaModel = new Escola();

export const escolaController = {
  async create(req, res, next) {
    try {
      const { nome_escola } = req.body;

      if (!nome_escola) {
        return res.status(400).json({
          success: false,
          message: 'Nome da escola é obrigatório'
        });
      }

      const escola = await escolaModel.create({ nome_escola });
      res.status(201).json({
        success: true,
        data: escola
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const escolas = await escolaModel.findAll();
      res.status(200).json({
        success: true,
        data: escolas
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const escola = await escolaModel.findById(id);
      res.status(200).json({
        success: true,
        data: escola
      });
    } catch (error) {
      next(error);
    }
  },

  async findWithTurmas(req, res, next) {
    try {
      const { id } = req.params;
      const escola = await escolaModel.findWithTurmas(id);
      res.status(200).json({
        success: true,
        data: escola
      });
    } catch (error) {
      next(error);
    }
  },

  async findAllWithStats(req, res, next) {
    try {
      const stats = await escolaModel.findAllWithStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome_escola } = req.body;

      if (!nome_escola) {
        return res.status(400).json({
          success: false,
          message: 'Nome da escola é obrigatório'
        });
      }

      const escola = await escolaModel.update(id, { nome_escola });
      res.status(200).json({
        success: true,
        data: escola
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await escolaModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Escola deletada com sucesso'
      });
    } catch (error) {
      next(error);
    }
  },

  async search(req, res, next) {
    try {
      const { nome } = req.query;
      const escolas = await escolaModel.getEscolaByNome(nome);
      res.status(200).json({
        success: true,
        data: escolas
      });
    } catch (error) {
      next(error);
    }
  }
};
