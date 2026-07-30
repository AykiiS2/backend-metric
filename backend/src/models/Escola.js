import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Escola extends BaseModel {
  constructor() {
    super('escolas');
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
      return data;
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
      return data;
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