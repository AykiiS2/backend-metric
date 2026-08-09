import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class LogEntrada extends BaseModel {
  constructor() {
    super('lobby_participantes');
  }

  async registrarEntrada(salaId, alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .insert({
          sala_id: salaId,
          aluno_id: alunoId,
          status: 'AGUARDANDO',
          entrou_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao registrar entrada: ${error.message}`, 400);
    }
  }

  async registrarSaida(salaId, alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .update({
          status: 'SAIU',
          saiu_em: new Date().toISOString(),
        })
        .eq('sala_id', salaId)
        .eq('aluno_id', alunoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao registrar saída: ${error.message}`, 400);
    }
  }

  async getAlunosNaSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select(`
          *,
          alunos (id_aluno, nome_aluno, rm)
        `)
        .eq('sala_id', salaId)
        .in('status', ['AGUARDANDO', 'FAZENDO']);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos: ${error.message}`, 400);
    }
  }

  async getHistoricoAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar histórico: ${error.message}`, 400);
    }
  }

  async getEstatisticasSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('sala_id', salaId);

      if (error) throw error;
      
      const total = data?.length || 0;
      const finalizados = data?.filter(p => p.status === 'FINALIZOU').length || 0;
      const emAndamento = data?.filter(p => p.status === 'FAZENDO').length || 0;
      const aguardando = data?.filter(p => p.status === 'AGUARDANDO').length || 0;
      
      return { total, finalizados, emAndamento, aguardando };
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }
}
