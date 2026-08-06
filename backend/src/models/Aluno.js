import { BaseModel } from './BaseModel.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';

export class Aluno extends BaseModel {
  constructor() {
    super('alunos');
  }

  async create(alunoData) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(alunoData.senha, salt);

      const data = {
        rm: alunoData.rm,
        email: alunoData.email,
        senha: hashedPassword,
        nome_aluno: alunoData.nome_aluno,
        id_escola: alunoData.id_escola,
        id_turma: alunoData.id_turma || null,
        pontuacao: 0
      };

      const { data: result, error } = await supabase
        .from('alunos')
        .insert(data)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          if (error.message.includes('rm')) {
            throw new AppError('RM já cadastrado', 409);
          }
          if (error.message.includes('email')) {
            throw new AppError('Email já cadastrado', 409);
          }
        }
        throw error;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('nome_aluno');

      if (error) {
        throw new AppError(`Erro ao buscar alunos: ${error.message}`, 400);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('id_aluno', id)
        .single();

      if (error) {
        throw new AppError('Aluno não encontrado', 404);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const updateData = {};
      if (data.nome_aluno !== undefined) updateData.nome_aluno = data.nome_aluno;
      if (data.rm !== undefined) updateData.rm = data.rm;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.id_turma !== undefined) updateData.id_turma = data.id_turma;

      const { data: aluno, error } = await supabase
        .from('alunos')
        .update(updateData)
        .eq('id_aluno', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao atualizar aluno: ${error.message}`, 500);
      }

      return aluno;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('alunos')
        .delete()
        .eq('id_aluno', id);

      if (error) {
        throw new AppError(`Erro ao deletar aluno: ${error.message}`, 500);
      }
    } catch (error) {
      throw error;
    }
  }

  async findByRM(rm) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('rm', rm)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar aluno: ${error.message}`, 400);
    }
  }

  async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar aluno: ${error.message}`, 400);
    }
  }

  async findByEscola(escolaId) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('id_escola', escolaId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos: ${error.message}`, 400);
    }
  }

  async findByTurma(turmaId) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('id_turma', turmaId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos: ${error.message}`, 400);
    }
  }

  async getRanking() {
  try {
    const { data: rankingData, error: rankingError } = await supabase
      .from('ranking_alunos')
      .select('id_aluno, nome_aluno, pontuacao')
      .order('pontuacao', { ascending: false })
      .order('nome_aluno', { ascending: true });

    if (rankingError) {
      throw rankingError;
    }

    if (!rankingData || rankingData.length === 0) {
      return [];
    }

    const alunoIds = [
      ...new Set(
        rankingData
          .map((item) => item.id_aluno)
          .filter((id) => id !== null && id !== undefined)
      )
    ];

    const { data: alunosData, error: alunosError } = await supabase
      .from('alunos')
      .select('id_aluno, id_turma')
      .in('id_aluno', alunoIds);

    if (alunosError) {
      throw alunosError;
    }

    const turmaIds = [
      ...new Set(
        (alunosData || [])
          .map((aluno) => aluno.id_turma)
          .filter((id) => id !== null && id !== undefined)
      )
    ];

    let turmasData = [];

    if (turmaIds.length > 0) {
      const { data, error } = await supabase
        .from('turmas')
        .select('id_turma, nome_turma, periodo')
        .in('id_turma', turmaIds);

      if (error) {
        throw error;
      }

      turmasData = data || [];
    }

    const alunosPorId = new Map(
      (alunosData || []).map((aluno) => [
        String(aluno.id_aluno),
        aluno
      ])
    );

    const turmasPorId = new Map(
      turmasData.map((turma) => [
        String(turma.id_turma),
        turma
      ])
    );

    return rankingData.map((item, index) => {
      const aluno = alunosPorId.get(String(item.id_aluno));
      const turma = aluno?.id_turma
        ? turmasPorId.get(String(aluno.id_turma))
        : null;

      return {
        posicao: index + 1,
        id_aluno: item.id_aluno,
        nome_aluno: item.nome_aluno,
        pontuacao: item.pontuacao ?? 0,
        id_turma: aluno?.id_turma ?? null,
        nome_turma: turma?.nome_turma ?? 'Sem turma',
        periodo: turma?.periodo ?? ''
      };
    });
  } catch (error) {
    throw new AppError(
      `Erro ao buscar ranking: ${error.message}`,
      400
    );
  }
}

async getRankingByTurma(turmaId) {
  try {
    const rankingCompleto = await this.getRanking();

    const rankingDaTurma = rankingCompleto.filter(
      (item) => String(item.id_turma) === String(turmaId)
    );

    return rankingDaTurma.map((item, index) => ({
      ...item,
      posicao: index + 1
    }));
  } catch (error) {
    throw new AppError(
      `Erro ao buscar ranking da turma: ${error.message}`,
      400
    );
  }
}

  async updatePontuacao(id) {
    try {
      const { data, error } = await supabase.rpc('atualizar_pontuacao_aluno', {
        p_aluno_id: id
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao atualizar pontuação: ${error.message}`, 400);
    }
  }

  async verifyPassword(rm, password) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('senha')
        .eq('rm', rm)
        .single();

      if (error || !data) {
        throw new AppError('Aluno não encontrado', 404);
      }

      const isValid = await bcrypt.compare(password, data.senha);
      return isValid;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(id, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const { data: aluno, error } = await supabase
        .from('alunos')
        .update({ senha: hashedPassword })
        .eq('id_aluno', id)
        .select()
        .single();

      if (error) {
        throw new AppError(`Erro ao atualizar senha: ${error.message}`, 400);
      }

      return aluno;
    } catch (error) {
      throw error;
    }
  }

  async validateAluno(rm, senha) {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('id_aluno, rm, nome_aluno, senha, id_escola, id_turma, pontuacao')
        .eq('rm', rm)
        .single();

      if (error || !data) {
        return null;
      }

      const isValid = await bcrypt.compare(senha, data.senha);
      
      if (!isValid) {
        return null;
      }

      return {
        id: data.id_aluno,
        rm: data.rm,
        nome: data.nome_aluno,
        id_escola: data.id_escola,
        id_turma: data.id_turma,
        pontuacao: data.pontuacao
      };
    } catch (error) {
      throw new AppError(`Erro ao validar aluno: ${error.message}`, 400);
    }
  }
}
