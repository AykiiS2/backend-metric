import { LobbySala } from '../models/LobbySala.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

const salaModel = new LobbySala();

export const salaController = {
  async create(req, res, next) {
    try {
      const { nomeSala, idEscola, idTurma, idAluno, idTabuada, dificuldade, modo, dataHora } = req.body;

      console.log('🔍 [salaController.create] Iniciando criação');
      console.log('🔍 [salaController.create] nomeSala:', nomeSala);
      console.log('🔍 [salaController.create] idTabuada:', idTabuada);

      if (!nomeSala || !idEscola || !idTurma || !idTabuada || !dificuldade || !modo || !dataHora) {
        return res.status(400).json({
          success: false,
          message: 'Nome, escola, turma, tabuada, dificuldade, modo e data/hora são obrigatórios'
        });
      }

      console.log('🔍 [salaController.create] Buscando tabuada da tabela tabuadas...');
      const { data: tabuadaData, error: tabuadaError } = await supabase
        .from('tabuadas')
        .select('*')
        .eq('id_tabuada', idTabuada)
        .single();

      if (tabuadaError || !tabuadaData) {
        console.error('❌ [salaController.create] Erro ao buscar tabuada:', tabuadaError);
        return res.status(404).json({
          success: false,
          message: 'Tabuada não encontrada'
        });
      }

      console.log('✅ [salaController.create] Tabuada encontrada:', tabuadaData.titulo);

      console.log('🔍 [salaController.create] Criando sala...');
      const sala = await salaModel.create({
        nomeSala,
        idEscola,
        idTurma,
        idAluno: idAluno || null,
        dificuldade,
        modo,
        dataHora
      });

      console.log('✅ [salaController.create] Sala criada ID:', sala.id_sala);

      console.log('🔍 [salaController.create] Salvando atividade na lobby_atividades...');
      const { data: atividade, error } = await supabase
        .from('lobby_atividades')
        .insert({
          sala_id: sala.id_sala,
          atividade: tabuadaData.tabuadas
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [salaController.create] Erro ao salvar atividade:', error);
        throw new AppError(`Erro ao salvar atividade: ${error.message}`, 500);
      }

      console.log('✅ [salaController.create] Atividade salva ID:', atividade.id);

      res.status(201).json({
        success: true,
        data: {
          sala: sala,
          atividade: atividade
        }
      });
    } catch (error) {
      console.error('❌ [salaController.create] Erro capturado:', error);
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
      const salas = await salaModel.getSalasAtivas();
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
      const sala = await salaModel.updateStatus(id, updateData.status);
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
