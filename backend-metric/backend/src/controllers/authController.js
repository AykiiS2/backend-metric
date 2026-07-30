import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { Aluno } from '../models/Aluno.js';

const alunoModel = new Aluno();

export const authController = {
  async loginProfessor(req, res, next) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new AppError('Credenciais inválidas', 401);
      }

      const { data: teacherData, error: teacherError } = await supabase
        .from('professores')
        .select('id, nome, email, role')
        .eq('email', email)
        .single();

      if (teacherError || !teacherData) {
        await supabase.auth.signOut();
        throw new AppError('Acesso permitido apenas para professores', 403);
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: teacherData.id,
            nome: teacherData.nome,
            email: teacherData.email,
            role: teacherData.role
          },
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        }
      });

    } catch (error) {
      next(error);
    }
  },

  async loginAluno(req, res, next) {
    try {
      const { rm, senha } = req.body;

      const aluno = await alunoModel.validateAluno(rm, senha);

      if (!aluno) {
        throw new AppError('RM ou senha inválidos', 401);
      }

      res.status(200).json({
        success: true,
        data: {
          aluno: {
            id: aluno.id,
            rm: aluno.rm,
            nome: aluno.nome,
            id_escola: aluno.id_escola,
            id_turma: aluno.id_turma,
            pontuacao: aluno.pontuacao
          }
        }
      });

    } catch (error) {
      next(error);
    }
  },

  async logoutProfessor(req, res, next) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      
      if (token) {
        await supabase.auth.signOut();
      }

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        throw new AppError('Refresh token não fornecido', 400);
      }

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token
      });

      if (error) {
        throw new AppError('Refresh token inválido', 401);
      }

      res.status(200).json({
        success: true,
        data: {
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        }
      });

    } catch (error) {
      next(error);
    }
  },

  async verifyToken(req, res, next) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new AppError('Token não fornecido', 400);
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new AppError('Token inválido', 401);
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
};