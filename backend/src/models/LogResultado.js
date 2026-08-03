import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class LogResultado extends BaseModel {
  constructor() {
    super('lobby_participantes');
  }

  async create(data) {
    try {
      const { sala_id, aluno_id, acertos, erros, tempo_segundos, nota } = data;

      const { data: result, error } = await supabase
        .from('lobby_participantes')
        .update({
          status: 'FINALIZOU',
          acertos: acertos || 0,
          erros: erros || 0,
          tempo_segundos: tempo_segundos || 0,
          nota: nota || 0,
          saiu_em: new Date().toISOString(),
        })
        .eq('sala_id', sala_id)
        .eq('aluno_id', aluno_id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw new AppError(`Erro ao salvar resultado: ${error.message}`, 400);
    }
  }

  async findByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('aluno_id', alunoId)
        .eq('status', 'FINALIZOU')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar resultados: ${error.message}`, 400);
    }
  }

  async findBySala(salaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('sala_id', salaId)
        .eq('status', 'FINALIZOU')
        .order('nota', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar resultados: ${error.message}`, 400);
    }
  }

  async getEstatisticasAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('aluno_id', alunoId)
        .eq('status', 'FINALIZOU');

      if (error) throw error;
      
      const total = data?.length || 0;
      const totalAcertos = data?.reduce((sum, p) => sum + (p.acertos || 0), 0) || 0;
      const totalErros = data?.reduce((sum, p) => sum + (p.erros || 0), 0) || 0;
      const mediaNota = total > 0 ? data.reduce((sum, p) => sum + (p.nota || 0), 0) / total : 0;
      
      return { total, totalAcertos, totalErros, mediaNota };
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }

  async getEstatisticasSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_participantes')
        .select('*')
        .eq('sala_id', salaId)
        .eq('status', 'FINALIZOU');

      if (error) throw error;
      
      const total = data?.length || 0;
      const totalAcertos = data?.reduce((sum, p) => sum + (p.acertos || 0), 0) || 0;
      const totalErros = data?.reduce((sum, p) => sum + (p.erros || 0), 0) || 0;
      const mediaNota = total > 0 ? data.reduce((sum, p) => sum + (p.nota || 0), 0) / total : 0;
      
      return { total, totalAcertos, totalErros, mediaNota };
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas: ${error.message}`, 400);
    }
  }
}
