import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Turma extends BaseModel {
  constructor() {
    super('turmas');
  }

  async create(data) {
    try {
      const { nome_turma, periodo, nivel_ensino, serie, id_escola } = data;

      if (!nome_turma || !periodo || !nivel_ensino || !serie || !id_escola) {
        throw new AppError('Todos os campos são obrigatórios', 400);
      }

      const { data: turma, error } = await supabase
        .from('turmas')
        .insert([{ nome_turma, periodo, nivel_ensino, serie, id_escola }])
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao criar turma: ${error.message}`, 500);
      }

      return turma;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const { nome_turma, periodo, nivel_ensino, serie, id_escola } = data;

      const updateData = {};
      if (nome_turma !== undefined) updateData.nome_turma = nome_turma;
      if (periodo !== undefined) updateData.periodo = periodo;
      if (nivel_ensino !== undefined) updateData.nivel_ensino = nivel_ensino;
      if (serie !== undefined) updateData.serie = serie;
      if (id_escola !== undefined) updateData.id_escola = id_escola;

      const { data: turma, error } = await supabase
        .from('turmas')
        .update(updateData)
        .eq('id_turma', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao atualizar turma: ${error.message}`, 500);
      }

      return turma;
    } catch (error) {
      throw error;
    }
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
