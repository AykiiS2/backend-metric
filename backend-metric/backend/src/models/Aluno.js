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
        ...alunoData,
        senha: hashedPassword,
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
      return data;
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
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar alunos: ${error.message}`, 400);
    }
  }

  async getRanking() {
    try {
      const { data, error } = await supabase
        .from('ranking_alunos')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar ranking: ${error.message}`, 400);
    }
  }

  async getRankingByTurma(turmaId) {
    try {
      const { data, error } = await supabase
        .from('ranking_alunos')
        .select('*')
        .eq('id_turma', turmaId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new AppError(`Erro ao buscar ranking da turma: ${error.message}`, 400);
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

      const result = await this.update(id, { senha: hashedPassword });
      return result;
    } catch (error) {
      throw new AppError(`Erro ao atualizar senha: ${error.message}`, 400);
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