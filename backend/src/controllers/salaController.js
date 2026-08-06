import { Sala } from '../models/Sala.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

const salaModel = new Sala();

export const salaController = {
  async create(req, res, next) {
    try {
      const { nomeSala, idEscola, idTurma, idAluno, tabuada, dificuldade, modo, dataHora } = req.body;

      if (!nomeSala || !idEscola || !idTurma || !tabuada || !dificuldade || !modo || !dataHora) {
        return res.status(400).json({
          success: false,
          message: 'Nome, escola, turma, tabuada, dificuldade, modo e data/hora são obrigatórios'
        });
      }

      if (!tabuada.operacoes || tabuada.operacoes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Tabuada precisa ter pelo menos uma operação'
        });
      }

      const sala = await salaModel.create({
        nomeSala,
        idEscola,
        idTurma,
        idAluno: idAluno || null,
        dificuldade,
        modo,
        dataHora
      });

      const atividadeData = { ...tabuada };
      delete atividadeData.id;
      delete atividadeData.created_at;
      delete atividadeData.aluno_id;

      const { data: atividade, error } = await supabase
        .from('lobby_atividades')
        .insert({
          sala_id: sala.id_sala,
          atividade: atividadeData
        })
        .select()
        .single();

      if (error) {
        await supabase.from('lobby_salas').delete().eq('id_sala', sala.id_sala);
        throw new AppError(`Erro ao salvar atividade: ${error.message}`, 500);
      }

      res.status(201).json({
        success: true,
        data: {
          sala: sala,
          atividade: atividade
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const salas = await salaModel.findAllWithAtividades();
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
      const sala = await salaModel.findByIdWithAtividades(id);
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
      next(error);
    }
  }
};
