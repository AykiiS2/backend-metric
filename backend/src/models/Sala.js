import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Sala extends BaseModel {
  constructor() {
    super('lobby_salas');
  }

  async create(data) {
    try {
      const { nome_sala, id_escola, id_turma, id_aluno, id_tabuada, tipo_tabuada, modo, data_hora } = data;

      if (!nome_sala) {
        throw new AppError('Nome da sala é obrigatório', 400);
      }

      const codigoAcesso = this._gerarCodigoAcesso();

      const insertData = {
        nome_sala,
        codigo_acesso: codigoAcesso,
        id_escola: id_escola || null,
        id_turma: id_turma || null,
        id_aluno: id_aluno || null,
        id_tabuada: id_tabuada || null,
        tipo_tabuada: tipo_tabuada || 'padrao',
        modo: modo || 'treinamento',
        data_hora: data_hora || new Date().toISOString(),
        status: 'ativa'
      };

      const { data: sala, error } = await supabase
        .from('lobby_salas')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao criar sala: ${error.message}`, 500);
      }

      return sala;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .order('data_hora', { ascending: false });

      if (error) {
        throw new AppError(`Erro ao buscar salas: ${error.message}`, 400);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_sala', id)
        .single();

      if (error) {
        throw new AppError('Sala não encontrada', 404);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findByEscola(escolaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_escola', escolaId)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas da escola: ${error.message}`, 400);
    }
  }

  async findByTurma(turmaId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_turma', turmaId)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas da turma: ${error.message}`, 400);
    }
  }

  async findByAluno(alunoId) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('id_aluno', alunoId)
        .order('data_hora', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas do aluno: ${error.message}`, 400);
    }
  }

  async findAtivas() {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .select('*')
        .eq('status', 'ativa')
        .gte('data_hora', new Date().toISOString())
        .order('data_hora', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar salas ativas: ${error.message}`, 400);
    }
  }

  async finalizar(id) {
    try {
      const { data, error } = await supabase
        .from('lobby_salas')
        .update({ status: 'finalizada' })
        .eq('id_sala', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao finalizar sala: ${error.message}`, 500);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  _gerarCodigoAcesso() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }
}
