import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Escola extends BaseModel {
  constructor() {
    super('escolas');
  }

  async create(data) {
    try {
      const { nome_escola } = data;

      if (!nome_escola) {
        throw new AppError('Nome da escola é obrigatório', 400);
      }

      const { data: escola, error } = await supabase
        .from('escolas')
        .insert([{ nome_escola }])
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao criar escola: ${error.message}`, 500);
      }

      return escola;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const { data, error } = await supabase
        .from('escolas')
        .select('*')
        .order('nome_escola');

      if (error) {
        throw new AppError(`Erro ao buscar escolas: ${error.message}`, 400);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('escolas')
        .select('*')
        .eq('id_escola', id)
        .single();

      if (error) {
        throw new AppError('Escola não encontrada', 404);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const { nome_escola } = data;

      if (!nome_escola) {
        throw new AppError('Nome da escola é obrigatório', 400);
      }

      const { data: escola, error } = await supabase
        .from('escolas')
        .update({ nome_escola })
        .eq('id_escola', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao atualizar escola: ${error.message}`, 500);
      }

      return escola;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('escolas')
        .delete()
        .eq('id_escola', id);

      if (error) {
        throw new AppError(`Erro ao deletar escola: ${error.message}`, 500);
      }
    } catch (error) {
      throw error;
    }
  }

  async findWithTurmas(id) {
    try {
      const { data, error } = await supabase
        .from('escolas')
        .select(`
          *,
          turmas (
            *,
            alunos (count)
          )
        `)
        .eq('id_escola', id)
        .single();

      if (error) throw error;
      if (!data) throw new AppError('Escola não encontrada', 404);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAllWithStats() {
    try {
      const { data, error } = await supabase
        .from('ranking_escolas')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar estatísticas das escolas: ${error.message}`, 400);
    }
  }

  async getEscolaByNome(nome) {
    try {
      const { data, error } = await supabase
        .from('escolas')
        .select('*')
        .ilike('nome_escola', `%${nome}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar escola: ${error.message}`, 400);
    }
  }

  async deleteWithCascade(id) {
    try {
      const result = await this.delete(id);
      return result;
    } catch (error) {
      throw new AppError(`Erro ao deletar escola: ${error.message}`, 400);
    }
  }
}
