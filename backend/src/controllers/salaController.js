import { Sala } from '../models/Sala.js';

const salaModel = new Sala();

export const salaController = {
  async create(req, res, next) {
    try {
      const { nome_sala, id_escola, id_turma, id_aluno, id_tabuada, tipo_tabuada, modo, data_hora } = req.body;

      if (!nome_sala) {
        return res.status(400).json({
          success: false,
          message: 'Nome da sala é obrigatório'
        });
      }

      const sala = await salaModel.create({
        nome_sala,
        id_escola,
        id_turma,
        id_aluno,
        id_tabuada,
        tipo_tabuada: tipo_tabuada || 'padrao',
        modo: modo || 'treinamento',
        data_hora
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
      res.status(200).json({
        success: true,
        data: salas
      });
    } catch (error) {
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
      const { nome_sala, id_escola, id_turma, id_aluno, id_tabuada, tipo_tabuada, modo, data_hora, status } = req.body;

      const updateData = {};
      if (nome_sala !== undefined) updateData.nome_sala = nome_sala;
      if (id_escola !== undefined) updateData.id_escola = id_escola;
      if (id_turma !== undefined) updateData.id_turma = id_turma;
      if (id_aluno !== undefined) updateData.id_aluno = id_aluno;
      if (id_tabuada !== undefined) updateData.id_tabuada = id_tabuada;
      if (tipo_tabuada !== undefined) updateData.tipo_tabuada = tipo_tabuada;
      if (modo !== undefined) updateData.modo = modo;
      if (data_hora !== undefined) updateData.data_hora = data_hora;
      if (status !== undefined) updateData.status = status;

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
