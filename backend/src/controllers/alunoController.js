import { Aluno } from '../models/Aluno.js';
import { AppError } from '../utils/errors.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const alunoModel = new Aluno();

export const alunoController = {
  async login(req, res, next) {
    try {
      const { rm, senha } = req.body;

      if (!rm || !senha) {
        return res.status(400).json({
          success: false,
          message: 'RM e senha são obrigatórios'
        });
      }

      const aluno = await alunoModel.findByRM(rm);

      if (!aluno) {
        return res.status(401).json({
          success: false,
          message: 'RM ou senha inválidos'
        });
      }

      const isValidPassword = await bcrypt.compare(senha, aluno.senha);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'RM ou senha inválidos'
        });
      }

      const token = jwt.sign(
        {
          id: aluno.id_aluno,
          rm: aluno.rm,
          email: aluno.email,
          role: 'aluno'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { senha: _, ...alunoSemSenha } = aluno;

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: alunoSemSenha,
        token: token
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { rm, email, senha, nome_aluno, id_escola, id_turma } = req.body;

      if (!rm || !email || !senha || !nome_aluno || !id_escola) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos obrigatórios devem ser preenchidos'
        });
      }

      const aluno = await alunoModel.create({
        rm,
        email,
        senha,
        nome_aluno,
        id_escola,
        id_turma
      });
      res.status(201).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const alunos = await alunoModel.findAll();
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const aluno = await alunoModel.findById(id);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findByRM(req, res, next) {
    try {
      const { rm } = req.params;
      const aluno = await alunoModel.findByRM(rm);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async findByEscola(req, res, next) {
    try {
      const { escolaId } = req.params;
      const alunos = await alunoModel.findByEscola(escolaId);
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async findByTurma(req, res, next) {
    try {
      const { turmaId } = req.params;
      const alunos = await alunoModel.findByTurma(turmaId);
      res.status(200).json({
        success: true,
        data: alunos
      });
    } catch (error) {
      next(error);
    }
  },

  async getRanking(req, res, next) {
    try {
      const ranking = await alunoModel.getRanking();
      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async getRankingByTurma(req, res, next) {
    try {
      const { turmaId } = req.params;
      const ranking = await alunoModel.getRankingByTurma(turmaId);
      res.status(200).json({
        success: true,
        data: ranking
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nome_aluno, rm, email } = req.body;

      if (!nome_aluno && !rm && !email) {
        return res.status(400).json({
          success: false,
          message: 'Pelo menos um campo deve ser informado para atualização'
        });
      }

      const updateData = {};
      if (nome_aluno) updateData.nome_aluno = nome_aluno;
      if (rm) updateData.rm = rm;
      if (email) updateData.email = email;

      const aluno = await alunoModel.update(id, updateData);
      res.status(200).json({
        success: true,
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await alunoModel.delete(id);
      res.status(200).json({
        success: true,
        message: 'Aluno deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { senha } = req.body;
      
      if (!senha || senha.length < 6) {
        throw new AppError('Senha deve ter no mínimo 6 caracteres', 400);
      }

      const aluno = await alunoModel.updatePassword(id, senha);
      res.status(200).json({
        success: true,
        message: 'Senha atualizada com sucesso',
        data: aluno
      });
    } catch (error) {
      next(error);
    }
  }
};
