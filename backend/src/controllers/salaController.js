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
      
      const { nomeSala, idEscola, idTurma, idAluno, idTabuada, dificuldade, modo, dataHora } = req.body;

      addLog('📝 DADOS RECEBIDOS:');
      addLog(`- nomeSala: ${nomeSala}`);
      addLog(`- idEscola: ${idEscola}`);
      addLog(`- idTurma: ${idTurma}`);
      addLog(`- idAluno: ${idAluno || 'null'}`);
      addLog(`- idTabuada: ${idTabuada}`);
      addLog(`- dificuldade: ${dificuldade}`);
      addLog(`- modo: ${modo}`);
      addLog(`- dataHora: ${dataHora}`);

      if (!nomeSala || !idEscola || !idTurma || !idTabuada || !dificuldade || !modo || !dataHora) {
        addLog('❌ ERRO: Campos obrigatórios faltando');
        return res.status(400).json({
          success: false,
          message: 'Nome, escola, turma, idTabuada, dificuldade, modo e data/hora são obrigatórios',
          log: log.join('\n')
        });
      }

      addLog('🔍 Buscando tabuada...');
      const { data: tabuada, error: tabuadaError } = await supabase
        .from('tabuadas')
        .select('id_tabuada, titulo, tabuadas')
        .eq('id_tabuada', idTabuada)
        .single();

      if (tabuadaError || !tabuada) {
        addLog('❌ Tabuada não encontrada!');
        return res.status(404).json({
          success: false,
          message: 'Tabuada não encontrada',
          error: tabuadaError,
          log: log.join('\n')
        });
      }

      addLog(`✅ Tabuada encontrada: ${tabuada.titulo}`);

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

      const atividadeData = {
        id_tabuada: tabuada.id_tabuada,
        titulo: tabuada.titulo,
        tabuadas: tabuada.tabuadas
      };

      addLog(`📦 atividadeData: ${JSON.stringify(atividadeData, null, 2).substring(0, 500)}...`);

      addLog('💾 Salvando na lobby_atividades...');
      const { data: atividade, error: atividadeError } = await supabase
        .from('lobby_atividades')
        .insert({
          sala_id: sala.id_sala,
          atividade: atividadeData
        })
        .select()
        .single();

      if (atividadeError) {
        addLog('❌ ERRO SUPABASE ao salvar atividade:');
        addLog(JSON.stringify(atividadeError, null, 2));
        
        addLog('🔄 Fazendo rollback - deletando sala...');
        await supabase
          .from('lobby_salas')
          .delete()
          .eq('id_sala', sala.id_sala);
        
        return res.status(500).json({
          success: false,
          message: `Erro ao salvar atividade: ${atividadeError.message}`,
          error: atividadeError,
          log: log.join('\n')
        });
      }

      addLog(`✅ Atividade salva com sucesso! ID: ${atividade.id}`);

      if (idAluno) {
        addLog('👤 Criando participante para sala individual...');
        const { data: participante, error: participanteError } = await supabase
          .from('lobby_participantes')
          .insert({
            sala_id: sala.id_sala,
            aluno_id: idAluno,
            status: 'AGUARDANDO',
            entrou_em: new Date().toISOString()
          })
          .select()
          .single();

        if (participanteError) {
          addLog('⚠️ Erro ao criar participante (não crítico):');
          addLog(JSON.stringify(participanteError, null, 2));
        } else {
          addLog(`✅ Participante criado: ${participante.id}`);
        }
      }

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

  async getDisponiveisPorAluno(req, res, next) {
    try {
      const { alunoId } = req.params;
      const { turmaId } = req.query;

      console.log('🔍 getDisponiveisPorAluno - alunoId:', alunoId);
      console.log('🔍 getDisponiveisPorAluno - turmaId:', turmaId);

      let query = supabase
        .from('lobby_salas')
        .select('*')
        .in('status', ['AGENDADA', 'ABERTA']);

      if (turmaId && turmaId.length > 0) {
        query = query.or(`turma_id.eq.${turmaId},aluno_id.eq.${alunoId}`);
      } else {
        query = query.eq('aluno_id', alunoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar salas:', error);
        throw error;
      }
      
      console.log(`✅ Salas disponíveis encontradas: ${data?.length || 0}`);
      
      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('💥 Erro em getDisponiveisPorAluno:', error);
      next(error);
    }
  },

  async getAtividade(req, res, next) {
    try {
      const { id } = req.params;

      console.log('🔍 getAtividade - salaId:', id);

      const { data, error } = await supabase
        .from('lobby_atividades')
        .select('*')
        .eq('sala_id', id)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar atividade:', error);
        throw error;
      }
      
      console.log('✅ Atividade encontrada:', data?.id);
      
      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error('💥 Erro em getAtividade:', error);
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
