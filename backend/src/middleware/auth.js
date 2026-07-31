import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔍 [AUTH] Iniciando autenticação');
    console.log('🔍 [AUTH] Headers:', req.headers);
    
    const authHeader = req.headers['authorization'];
    console.log('🔍 [AUTH] Authorization header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('🔍 [AUTH] Token extraído:', token ? token.substring(0, 30) + '...' : 'null');
    console.log('🔍 [AUTH] Tamanho do token:', token ? token.length : 0);
    console.log('🔍 [AUTH] JWT_SECRET existe?', process.env.JWT_SECRET ? '✅ SIM' : '❌ NÃO');

    if (!token) {
      console.error('❌ [AUTH] Token não fornecido');
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    try {
      console.log('🔍 [AUTH] Tentando validar token com JWT_SECRET...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ [AUTH] Token decodificado com sucesso:', {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });

      console.log('🔍 [AUTH] Buscando dados do professor...');
      const { data: teacherData, error: teacherError } = await supabase
        .from('professores')
        .select('id, nome, email, role')
        .eq('email', decoded.email)
        .single();

      console.log('🔍 [AUTH] Dados do professor:', {
        encontrado: teacherData ? '✅ SIM' : '❌ NÃO',
        error: teacherError ? teacherError.message : 'sem erro'
      });

      if (teacherError || !teacherData) {
        console.error('❌ [AUTH] Professor não encontrado');
        throw new AppError('Usuário não autorizado como professor', 403);
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        teacherId: teacherData.id,
        nome: teacherData.nome,
        role: teacherData.role
      };
      req.userId = decoded.id;
      req.teacherId = teacherData.id;
      
      console.log('✅ [AUTH] Autenticação bem-sucedida para:', teacherData.email);
      next();
    } catch (jwtError) {
      console.error('❌ [AUTH] Erro ao validar JWT:', {
        message: jwtError.message,
        name: jwtError.name
      });
      throw new AppError('Token inválido ou expirado', 401);
    }
  } catch (error) {
    console.error('❌ [AUTH] Erro capturado:', error.message);
    next(error);
  }
};

export const verifyTeacherCredentials = async (req, res, next) => {
  try {
    console.log('🔍 [VERIFY] Verificando credenciais');
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email e senha são obrigatórios', 400);
    }

    console.log('🔍 [VERIFY] Autenticando no Supabase...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ [VERIFY] Erro no Supabase:', error.message);
      throw new AppError('Credenciais inválidas', 401);
    }

    console.log('🔍 [VERIFY] Buscando dados do professor...');
    const { data: teacherData, error: teacherError } = await supabase
      .from('professores')
      .select('id, nome, email, role')
      .eq('email', email)
      .single();

    if (teacherError || !teacherData) {
      console.error('❌ [VERIFY] Professor não encontrado');
      await supabase.auth.signOut();
      throw new AppError('Usuário não é um professor autorizado', 403);
    }

    console.log('✅ [VERIFY] Professor encontrado:', teacherData.email);
    console.log('🔍 [VERIFY] Gerando token customizado...');

    const customToken = jwt.sign(
      {
        id: data.user.id,
        email: data.user.email,
        role: 'professor'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ [VERIFY] Token gerado com sucesso');

    req.teacher = {
      id: teacherData.id,
      nome: teacherData.nome,
      email: teacherData.email,
      role: teacherData.role,
      token: customToken,
      refreshToken: data.session.refresh_token
    };

    next();
  } catch (error) {
    console.error('❌ [VERIFY] Erro capturado:', error.message);
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
