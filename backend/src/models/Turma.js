import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Turma extends BaseModel {
  constructor() {
    super('turmas');
  }

  async findWithAlunos(id) {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select(`
          *,
          escolas (nome_escola),
          alunos (*)
        `)
        .eq('id_turma', id)
        .single();

      if (error) throw error;
      if (!data) throw new AppError('Turma não encontrada', 404);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findByEscola(escolaId) {
    try {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .eq('id_escola', escolaId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar turmas: ${error.message}`, 400);
    }
  }

  async getRanking() {
    try {
      const { data, error } = await supabase
        .from('ranking_turmas')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar ranking das turmas: ${error.message}`, 400);
    }
  }

  async getAlunosCount(id) {
    try {
      const { count, error } = await supabase
        .from('alunos')
        .select('*', { count: 'exact', head: true })
        .eq('id_turma', id);

      if (error) throw error;
      return count;
    } catch (error) {
      throw new AppError(`Erro ao contar alunos: ${error.message}`, 400);
    }
  }

  async getPontuacaoTotal(id) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('pontuacao')
        .eq('id_turma', id);

      if (error) throw error;
      
      const total = data.reduce((sum, aluno) => sum + (aluno.pontuacao || 0), 0);
      return total;
    } catch (error) {
      throw new AppError(`Erro ao calcular pontuação: ${error.message}`, 400);
    }
  }
}