import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

export class Sala {
  constructor() {
    this.tableName = 'lobby_salas';
  }

  async create(data) {
    try {
      const { nomeSala, idEscola, idTurma, idAluno, tabuada, dificuldade, modo, dataHora } = data;

      if (!nomeSala || !idEscola || !idTurma || !tabuada || !dificuldade || !modo || !dataHora) {
        throw new AppError('Todos os campos obrigatórios devem ser preenchidos', 400);
      }

      const codigoAcesso = this._gerarCodigoAcesso();

      const insertData = {
        nome_sala: nomeSala,
        escola_id: idEscola,
        turma_id: idTurma,
        tabuada: tabuada,
        dificuldade: dificuldade,
        modo: modo,
        inicio: dataHora,
        codigo_acesso: codigoAcesso,
        status: 'AGENDADA'
      };

      if (idAluno) {
        insertData.aluno_id = idAluno;
      }

      const { data: sala, error } = await supabase
        .from('lobby_salas')
        .insert([insertData])
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
        .order('inicio', { ascending: false });

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
        .eq('escola_id', escolaId)
        .order('inicio', { ascending: false });

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
        .eq('turma_id', turmaId)
        .order('inicio', { ascending: false });

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
        .eq('aluno_id', alunoId)
        .order('inicio', { ascending: false });

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
        .eq('status', 'AGENDADA')
        .gte('inicio', new Date().toISOString())
        .order('inicio', { ascending: true });

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
        .update({ status: 'ENCERRADA' })
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

  async update(id, data) {
    try {
      const { data: sala, error } = await supabase
        .from('lobby_salas')
        .update(data)
        .eq('id_sala', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao atualizar sala: ${error.message}`, 500);
      }

      return sala;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('lobby_salas')
        .delete()
        .eq('id_sala', id);

      if (error) {
        throw new AppError(`Erro ao deletar sala: ${error.message}`, 500);
      }
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
