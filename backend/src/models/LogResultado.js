import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class LogResultado extends BaseModel {
  constructor() {
    super('logs_resultados');
  }

  async create(resultadoData) {
    try {
      const data = {
        ...resultadoData,
        data_hora: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('logs_resultados')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw new AppError(`Erro ao registrar resultado: ${error.message}`, 400);
    }
  }

  async findByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select(`
          *,
          lobby_salas (nome_sala, codigo_acesso),
          tabuadas (tipo, numero)
        `)
        .eq('id_aluno', alunoId)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar resultados: ${error.message}`, 400);
    }
  }

  async findBySala(salaId) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select(`
          *,
          alunos (id_aluno, nome_aluno, rm)
        `)
        .eq('id_sala', salaId)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar resultados: ${error.message}`, 400);
    }
  }

  async getEstatisticasAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select('*')
        .eq('id_aluno', alunoId);

      if (error) throw error;

      const stats = {
        total_partidas: data.length,
        total_acertos: data.reduce((sum, log) => sum + (log.acertos || 0), 0),
        total_erros: data.reduce((sum, log) => sum + (log.erros || 0), 0),
        total_pontuacao: data.reduce((sum, log) => sum + (log.pontuacao_obtida || 0), 0),
        media_acertos: 0,
        melhor_pontuacao: 0
      };

      if (data.length > 0) {
        stats.media_acertos = Math.round(stats.total_acertos / data.length);
        stats.melhor_pontuacao = Math.max(...data.map(log => log.pontuacao_obtida || 0));
      }

      return stats;
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }

  async getEstatisticasSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select(`
          *,
          alunos (nome_aluno)
        `)
        .eq('id_sala', salaId);

      if (error) throw error;

      const stats = {
        total_partidas: data.length,
        alunos_unicos: new Set(data.map(log => log.id_aluno)).size,
        total_acertos: data.reduce((sum, log) => sum + (log.acertos || 0), 0),
        total_erros: data.reduce((sum, log) => sum + (log.erros || 0), 0),
        media_pontuacao: 0,
        ranking: []
      };

      if (data.length > 0) {
        stats.media_pontuacao = Math.round(
          data.reduce((sum, log) => sum + (log.pontuacao_obtida || 0), 0) / data.length
        );

        const alunosMap = new Map();
        data.forEach(log => {
          if (!alunosMap.has(log.id_aluno)) {
            alunosMap.set(log.id_aluno, {
              id_aluno: log.id_aluno,
              nome_aluno: log.alunos?.nome_aluno || 'Desconhecido',
              total_pontuacao: 0,
              total_partidas: 0,
              total_acertos: 0,
              total_erros: 0
            });
          }
          const aluno = alunosMap.get(log.id_aluno);
          aluno.total_pontuacao += log.pontuacao_obtida || 0;
          aluno.total_partidas++;
          aluno.total_acertos += log.acertos || 0;
          aluno.total_erros += log.erros || 0;
        });

        stats.ranking = Array.from(alunosMap.values())
          .sort((a, b) => b.total_pontuacao - a.total_pontuacao);
      }

      return stats;
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }

  async getResultadosByPeriodo(alunoId, inicio, fim) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select('*')
        .eq('id_aluno', alunoId)
        .gte('data_hora', inicio)
        .lte('data_hora', fim)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar resultados: ${error.message}`, 400);
    }
  }
}