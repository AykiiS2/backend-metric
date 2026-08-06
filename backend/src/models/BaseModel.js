import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  async findAll(filters = {}) {
    try {
      let query = this.supabase.from(this.tableName).select('*');
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.eq(key, filters[key]);
        }
      });

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar dados: ${error.message}`, 400);
    }
  }

  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new AppError('Registro não encontrado', 404);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw new AppError(`Erro ao criar registro: ${error.message}`, 400);
    }
  }

  async update(id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new AppError('Registro não encontrado', 404);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new AppError('Registro não encontrado', 404);
      }
      
      return data[0];
    } catch (error) {
      throw error;
    }
  }
}
