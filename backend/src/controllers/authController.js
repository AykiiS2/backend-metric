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

      res.json({
        success: true,
        data: {
          token: token,
          refreshToken: null,
          user: {
            id: user.id,
            nome: user.email?.split('@').first || user.email,
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
          role: 'aluno'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token: token,
          refreshToken: null,
          user: {
            id: user.id,
            email: user.email,
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

      const { data: { session }, error } = await supabase.auth.refreshSession({
        refresh_token: refresh_token
      });

      if (error) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }

      res.json({
        success: true,
        data: {
          token: session.access_token,
          refreshToken: session.refresh_token
        }
      });

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
