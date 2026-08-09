import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class LobbySala extends BaseModel {
  constructor() {
    super('lobby_salas');
  }

  generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async create(salaData) {
    try {
      const codigo = this.generateAccessCode();

      const data = {
        nome_sala: salaData.nomeSala,
        escola_id: salaData.idEscola,
        turma_id: salaData.idTurma,
        aluno_id: salaData.idAluno || null,
        dificuldade: salaData.dificuldade || 'Médio',
        modo: salaData.modo || 'TREINAMENTO',
        status: 'AGENDADA',
        inicio: salaData.dataHora,
        horario_abertura: salaData.dataHora,
        codigo_acesso: codigo
      };

      const { data: result, error } = await supabase
        .from('lobby_salas')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      throw new AppError(`Erro ao criar sala: ${error.message}`, 400);
    }
  }

  async findAll() {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .order('inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_sala', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar sala: ${error.message}`, 400);
    }
  }

  async findByCodigo(codigo) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('codigo_acesso', codigo.toUpperCase())
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar sala: ${error.message}`, 400);
    }
  }

  async findByEscola(escolaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('escola_id', escolaId)
        .order('inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async findByTurma(turmaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('turma_id', turmaId)
        .order('inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async findByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('aluno_id', alunoId)
        .order('inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async getSalasAtivas() {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('status', 'ABERTA')
        .order('inicio', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas ativas: ${error.message}`, 400);
    }
  }

  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .update({ status })
        .eq('id_sala', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao atualizar status: ${error.message}`, 400);
    }
  }

  async finalizar(id) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .update({ status: 'ENCERRADA' })
        .eq('id_sala', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao finalizar sala: ${error.message}`, 400);
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('lobby_salas')
        .delete()
        .eq('id_sala', id);

      if (error) throw error;
    } catch (error) {
      throw new AppError(`Erro ao deletar sala: ${error.message}`, 400);
    }
  }
}
