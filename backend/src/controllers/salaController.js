import { LobbySala } from '../models/LobbySala.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

const salaModel = new LobbySala();

export const salaController = {
  async create(req, res, next) {
    let log = [];
    
    const addLog = (data) => {
      log.push(data);
      console.log(data);
    };

    try {
      addLog('='.repeat(80));
      addLog(`📅 LOG: ${new Date().toISOString()}`);
      addLog('='.repeat(80));
      
      const { nomeSala, idEscola, idTurma, idAluno, tabuada, dificuldade, modo, dataHora } = req.body;

      addLog('📝 DADOS RECEBIDOS:');
      addLog(`- nomeSala: ${nomeSala}`);
      addLog(`- idEscola: ${idEscola}`);
      addLog(`- idTurma: ${idTurma}`);
      addLog(`- idAluno: ${idAluno || 'null'}`);
      addLog(`- dificuldade: ${dificuldade}`);
      addLog(`- modo: ${modo}`);
      addLog(`- dataHora: ${dataHora}`);
      addLog(`- tabuada existe: ${!!tabuada}`);
      addLog(`- tabuada.tabuadas existe: ${!!tabuada?.tabuadas}`);
      
      if (tabuada) {
        addLog(`- tabuada.id_tabuada: ${tabuada.id_tabuada}`);
        addLog(`- tabuada.titulo: ${tabuada.titulo}`);
        addLog(`- tabuada.tipo: ${tabuada.tabuadas?.tipo}`);
        addLog(`- quantidade operacoes: ${tabuada.tabuadas?.operacoes?.length || 0}`);
      }

      if (!nomeSala || !idEscola || !idTurma || !tabuada || !dificuldade || !modo || !dataHora) {
        addLog('❌ ERRO: Campos obrigatórios faltando');
        return res.status(400).json({
          success: false,
          message: 'Nome, escola, turma, tabuada, dificuldade, modo e data/hora são obrigatórios',
          log: log.join('\n')
        });
      }

      addLog('🏫 Criando sala...');
      const sala = await salaModel.create({
        nomeSala,
        idEscola,
        idTurma,
        idAluno: idAluno || null,
        dificuldade,
        modo,
        dataHora
      });

      addLog(`✅ Sala criada: ${JSON.stringify(sala, null, 2)}`);

      if (!sala || !sala.id_sala) {
        addLog('❌ ERRO: Sala criada sem ID!');
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar sala: ID não retornado',
          data: sala,
          log: log.join('\n')
        });
      }

      const atividadeData = tabuada.tabuadas || tabuada;

      addLog(`📦 atividadeData: ${JSON.stringify(atividadeData, null, 2).substring(0, 500)}...`);

      addLog('💾 Tentando salvar na lobby_atividades...');
      addLog(`- sala_id: ${sala.id_sala}`);
      addLog(`- atividade: ${JSON.stringify(atividadeData, null, 2).substring(0, 200)}...`);

      const { data: atividade, error } = await supabase
        .from('lobby_atividades')
        .insert({
          sala_id: sala.id_sala,
          atividade: atividadeData
        })
        .select()
        .single();

      if (error) {
        addLog('❌ ERRO SUPABASE:');
        addLog(JSON.stringify(error, null, 2));
        addLog(`- error.code: ${error.code}`);
        addLog(`- error.message: ${error.message}`);
        addLog(`- error.details: ${error.details}`);
        addLog(`- error.hint: ${error.hint}`);
        
        return res.status(500).json({
          success: false,
          message: `Erro ao salvar atividade: ${error.message}`,
          error: error,
          log: log.join('\n')
        });
      }

      addLog(`✅ Atividade salva com sucesso! ID: ${atividade.id}`);

      res.status(201).json({
        success: true,
        data: {
          sala: sala,
          atividade: atividade
        },
        log: log.join('\n')
      });
      
      addLog('✅ RESPOSTA ENVIADA COM SUCESSO');
      
    } catch (error) {
      addLog('💥 ERRO CAPTURADO:');
      addLog(JSON.stringify(error, null, 2));
      addLog(`- error.message: ${error.message}`);
      addLog(`- error.stack: ${error.stack}`);
      
      console.error('💥 ERRO:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno',
        stack: error.stack,
        log: log.join('\n')
      });
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
