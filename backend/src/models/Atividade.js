import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Atividade extends BaseModel {
  constructor() {
    super('lobby_atividades');
  }

  async create(data) {
    try {
      const { salaId, atividade } = data;

      if (!salaId || !atividade) {
        throw new AppError('Sala ID e atividade são obrigatórios', 400);
      }

      const { data: result, error } = await supabase
        .from('lobby_atividades')
        .insert([{
          sala_id: salaId,
          atividade: atividade
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao criar atividade: ${error.message}`, 500);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findBySala(salaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_atividades')
        .select('*')
        .eq('sala_id', salaId)
        .order('criado_em', { ascending: true });

      if (error) {
        throw new AppError(`Erro ao buscar atividades: ${error.message}`, 400);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('lobby_atividades')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AppError(`Erro ao deletar atividade: ${error.message}`, 500);
      }
    } catch (error) {
      throw error;
    }
  }
}
