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
      const { data, error } = await supabase
        .from('ranking_alunos')
        .select('*');

      if (error) throw error;
      return data || [];
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

      if (error
