import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔍 [authenticateToken] Iniciando autenticação');
    console.log('🔍 [authenticateToken] Headers recebidos:', JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers['authorization'];
    console.log('🔍 [authenticateToken] Authorization header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('🔍 [authenticateToken] Token extraído:', token ? token.substring(0, 30) + '...' : 'null');
    console.log('🔍 [authenticateToken] Tamanho do token:', token ? token.length : 0);

    if (!token) {
      console.error('❌ [authenticateToken] Token não fornecido');
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    console.log('🔍 [authenticateToken] Tentando validar token no Supabase...');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    console.log('🔍 [authenticateToken] Resultado da validação:');
    console.log('  - User:', user ? `✅ ID: ${user.id}, Email: ${user.email}` : '❌ Nenhum usuário');
    console.log('  - Error:', error ? `❌ ${error.message}` : '✅ Sem erro');

    if (error || !user) {
      console.error('❌ [authenticateToken] Erro na validação do token:', error);
      throw new AppError('Token inválido ou expirado', 401);
    }

    console.log('🔍 [authenticateToken] Buscando dados do professor...');
    
    const { data: teacherData, error: teacherError } = await supabase
      .from('professores')
      .select('id, nome, email, role')
      .eq('email', user.email)
      .single();

    console.log('🔍 [authenticateToken] Dados do professor:');
    console.log('  - TeacherData:', teacherData ? `✅ ID: ${teacherData.id}, Nome: ${teacherData.nome}` : '❌ Não encontrado');
    console.log('  - TeacherError:', teacherError ? `❌ ${teacherError.message}` : '✅ Sem erro');

    if (teacherError || !teacherData) {
      console.error('❌ [authenticateToken] Professor não autorizado');
      await supabase.auth.signOut();
      throw new AppError('Usuário não autorizado como professor', 403);
    }

    console.log('✅ [authenticateToken] Autenticação bem-sucedida para:', teacherData.email);

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
    console.error('❌ [authenticateToken] Erro capturado:', {
      message: error.message,
      stack: error.stack,
      status: error.status || 500
    });
    next(error);
  }
};

export const verifyTeacherCredentials = async (req, res, next) => {
  try {
    console.log('🔍 [verifyTeacherCredentials] Iniciando verificação de credenciais');
    console.log('🔍 [verifyTeacherCredentials] Body recebido:', { 
      email: req.body.email, 
      password: req.body.password ? '***' : 'undefined' 
    });

    const { email, password } = req.body;

    if (!email || !password) {
      console.error('❌ [verifyTeacherCredentials] Email ou senha não fornecidos');
      throw new AppError('Email e senha são obrigatórios', 400);
    }

    console.log('🔍 [verifyTeacherCredentials] Tentando autenticar no Supabase...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('🔍 [verifyTeacherCredentials] Resultado da autenticação Supabase:');
    console.log('  - Data:', data ? `✅ Session: ${data.session ? 'OK' : '❌ Sem sessão'}` : '❌ Sem dados');
    console.log('  - Error:', error ? `❌ ${error.message}` : '✅ Sem erro');

    if (error) {
      console.error('❌ [verifyTeacherCredentials] Erro no Supabase:', error);
      throw new AppError('Credenciais inválidas', 401);
    }

    console.log('🔍 [verifyTeacherCredentials] Buscando dados do professor...');

    const { data: teacherData, error: teacherError } = await supabase
      .from('professores')
      .select('id, nome, email, role')
      .eq('email', email)
      .single();

    console.log('🔍 [verifyTeacherCredentials] Dados do professor:');
    console.log('  - TeacherData:', teacherData ? `✅ ID: ${teacherData.id}, Nome: ${teacherData.nome}` : '❌ Não encontrado');
    console.log('  - TeacherError:', teacherError ? `❌ ${teacherError.message}` : '✅ Sem erro');

    if (teacherError || !teacherData) {
      console.error('❌ [verifyTeacherCredentials] Professor não autorizado');
      await supabase.auth.signOut();
      throw new AppError('Usuário não é um professor autorizado', 403);
    }

    console.log('✅ [verifyTeacherCredentials] Professor autenticado:', teacherData.email);
    console.log('🔍 [verifyTeacherCredentials] Token gerado:', data.session.access_token ? data.session.access_token.substring(0, 30) + '...' : 'null');

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
    console.error('❌ [verifyTeacherCredentials] Erro capturado:', {
      message: error.message,
      stack: error.stack,
      status: error.status || 500
    });
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
