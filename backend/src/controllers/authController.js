import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: Variáveis SUPABASE_URL e SUPABASE_KEY não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const authController = {
  async loginProfessor(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: 'professor'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          role: 'professor'
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        success: true,
        data: {
          token: token,
          refreshToken: refreshToken,
          user: {
            id: user.id,
            nome: user.email?.split('@')[0] || user.email,
            email: user.email,
            role: 'professor'
          }
        }
      });

    } catch (error) {
      console.error('Erro no loginProfessor:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async loginAluno(req, res) {
    try {
      const aluno = req.aluno;

      const token = jwt.sign(
        {
          id: aluno.id,
          rm: aluno.rm,
          role: 'aluno'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const refreshToken = jwt.sign(
        {
          id: aluno.id,
          role: 'aluno'
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        success: true,
        data: {
          token: token,
          refreshToken: refreshToken,
          user: {
            id: aluno.id,
            rm: aluno.rm,
            nome: aluno.nome,
            role: 'aluno'
          }
        }
      });

    } catch (error) {
      console.error('Erro no loginAluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token é obrigatório'
        });
      }

      try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

        const newToken = jwt.sign(
          {
            id: decoded.id,
            role: decoded.role,
            ...(decoded.email && { email: decoded.email }),
            ...(decoded.rm && { rm: decoded.rm })
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        const newRefreshToken = jwt.sign(
          {
            id: decoded.id,
            role: decoded.role
          },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        return res.json({
          success: true,
          data: {
            token: newToken,
            refreshToken: newRefreshToken
          }
        });
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Refresh token expirado'
          });
        }
        return res.status(401).json({
          success: false,
          message: 'Refresh token inválido'
        });
      }
    } catch (error) {
      console.error('Erro no refreshToken:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async logoutProfessor(req, res) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer logout'
        });
      }

      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });

    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async logoutAluno(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logoutAluno:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        success: true,
        data: decoded
      });

    } catch (error) {
      console.error('Erro no verifyToken:', error);
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
};
