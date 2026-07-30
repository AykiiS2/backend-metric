import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class LogEntrada extends BaseModel {
  constructor() {
    super('logs_entrada');
  }

  async registrarEntrada(salaId, alunoId) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('logs_entrada')
        .select('*')
        .eq('id_sala', salaId)
        .eq('id_aluno', alunoId)
        .is('data_hora_saida', null)
        .single();

      if (existing) {
        throw new AppError('Aluno já está na sala', 409);
      }

      const data = {
        id_sala: salaId,
        id_aluno: alunoId,
        data_hora_entrada: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('logs_entrada')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async registrarSaida(salaId, alunoId) {
    try {
      const horaSaida = new Date().toISOString();

      const { data: log, error: findError } = await supabase
        .from('logs_entrada')
        .select('*')
        .eq('id_sala', salaId)
        .eq('id_aluno', alunoId)
        .is('data_hora_saida', null)
        .single();

      if (findError || !log) {
        throw new AppError('Aluno não está na sala', 404);
      }

      const entrada = new Date(log.data_hora_entrada);
      const saida = new Date(horaSaida);
      const tempoPermanencia = Math.floor((saida - entrada) / 1000);

      const { data: result, error } = await supabase
        .from('logs_entrada')
        .update({
          data_hora_saida: horaSaida,
          tempo_permanencia: tempoPermanencia
        })
        .eq('id_log', log.id_log)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAlunosNaSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('logs_entrada')
        .select(`
          *,
          alunos (id_aluno, nome_aluno, rm)
        `)
        .eq('id_sala', salaId)
        .is('data_hora_saida', null);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos na sala: ${error.message}`, 400);
    }
  }

  async getHistoricoAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('logs_entrada')
        .select(`
          *,
          lobby_salas (nome_sala, codigo_acesso)
        `)
        .eq('id_aluno', alunoId)
        .order('data_hora_entrada', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar histórico: ${error.message}`, 400);
    }
  }

  async getEstatisticasSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('logs_entrada')
        .select('*')
        .eq('id_sala', salaId);

      if (error) throw error;

      const stats = {
        total_entradas: data.length,
        alunos_unicos: new Set(data.map(log => log.id_aluno)).size,
        tempo_medio: 0,
        alunos_na_sala: data.filter(log => !log.data_hora_saida).length
      };

      const entradasComSaida = data.filter(log => log.tempo_permanencia);
      if (entradasComSaida.length > 0) {
        const somaTempos = entradasComSaida.reduce((sum, log) => sum + log.tempo_permanencia, 0);
        stats.tempo_medio = Math.floor(somaTempos / entradasComSaida.length);
      }

      return stats;
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }
}