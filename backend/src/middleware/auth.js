import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Token inválido ou expirado', 401);
    }

    const { data: teacherData, error: teacherError } = await supabase
      .from('professores')
      .select('id, nome, email, role')
      .eq('email', user.email)
      .single();

    if (teacherError || !teacherData) {
      await supabase.auth.signOut();
      throw new AppError('Usuário não autorizado como professor', 403);
    }

    req.user = {
      ...user,
      teacherId: teacherData.id,
      nome: teacherData.nome,
      role: teacherData.role
    };
    req.userId = user.id;
    req.teacherId = teacherData.id;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyTeacherCredentials = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios', 400);
    }

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
      throw new AppError('Usuário não é um professor autorizado', 403);
    }

    req.teacher = {
      id: teacherData.id,
      nome: teacherData.nome,
      email: teacherData.email,
      role: teacherData.role,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAluno = async (req, res, next) => {
  try {
    const { rm, senha } = req.body;

    if (!rm || !senha) {
      throw new AppError('RM e senha são obrigatórios', 400);
    }

    const { data: aluno, error } = await supabase
      .from('alunos')
      .select('id_aluno, rm, nome_aluno, senha, id_escola, id_turma, pontuacao')
      .eq('rm', rm)
      .single();

    if (error || !aluno) {
      throw new AppError('Aluno não encontrado', 404);
    }

    const isValidPassword = await bcrypt.compare(senha, aluno.senha);

    if (!isValidPassword) {
      throw new AppError('Senha inválida', 401);
    }

    req.aluno = {
      id: aluno.id_aluno,
      rm: aluno.rm,
      nome: aluno.nome_aluno,
      id_escola: aluno.id_escola,
      id_turma: aluno.id_turma,
      pontuacao: aluno.pontuacao
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        throw new AppError('Usuário não autenticado', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('Sem permissão para acessar este recurso', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};