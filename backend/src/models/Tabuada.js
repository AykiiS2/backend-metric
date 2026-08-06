import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Tabuada extends BaseModel {
  constructor() {
    super('tabuadas');
  }

  async findByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('tabuadas')
        .select('*')
        .eq('id_aluno', alunoId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar tabuadas: ${error.message}`, 400);
    }
  }

  async findByTipo(tipo) {
    try {
      const { data, error } = await supabase
        .from('tabuadas')
        .select('*')
        .eq('tipo', tipo);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar tabuadas: ${error.message}`, 400);
    }
  }

  async findByAlunoAndTipo(alunoId, tipo) {
    try {
      const { data, error } = await supabase
        .from('tabuadas')
        .select('*')
        .eq('id_aluno', alunoId)
        .eq('tipo', tipo);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar tabuadas: ${error.message}`, 400);
    }
  }

  async createMultiple(tabuadas) {
    try {
      const { data, error } = await supabase
        .from('tabuadas')
        .insert(tabuadas)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao criar tabuadas: ${error.message}`, 400);
    }
  }

  async getResultadosByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('logs_resultados')
        .select(`
          *,
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
}