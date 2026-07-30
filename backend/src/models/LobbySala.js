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
        ...salaData,
        codigo_acesso: codigo,
        status: 'ativa'
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
        .select(`
          *,
          turmas (nome_turma),
          escolas (nome_escola)
        `)
        .eq('id_escola', escolaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async findByTurma(turmaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_turma', turmaId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
    }
  }

  async getSalasAtivas() {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('status', 'ativa');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar salas ativas: ${error.message}`, 400);
    }
  }

  async updateStatus(id, status) {
    try {
      const result = await this.update(id, { status });
      return result;
    } catch (error) {
      throw new AppError(`Erro ao atualizar status da sala: ${error.message}`, 400);
    }
  }

  async getAlunosNaSala(salaId) {
    try {
      const { data, error } = await supabase
        .from('logs_entrada')
        .select(`
          id_aluno,
          data_hora_entrada,
          alunos (id_aluno, nome_aluno, rm)
        `)
        .eq('id_sala', salaId)
        .is('data_hora_saida', null);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos na sala: ${error.message}`, 400);
    }
  }
}