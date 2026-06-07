const AlunoService = require('../services/alunoService');

class AlunoController {
    static async create(req, res, next) {
        try {
            const aluno = await AlunoService.createAluno(req.body);
            res.status(201).json({ success: true, data: aluno });
        } catch (error) {
            next(error);
        }
    }
    
    static async getAll(req, res, next) {
        try {
            const { id_escola, id_turma } = req.query;
            const filters = {};
            if (id_escola) filters.id_escola = id_escola;
            if (id_turma) filters.id_turma = id_turma;
            
            const alunos = await AlunoService.getAllAlunos(filters);
            res.status(200).json({ success: true, data: alunos });
        } catch (error) {
            next(error);
        }
    }
    
    static async getById(req, res, next) {
        try {
            const aluno = await AlunoService.getAlunoById(req.params.id);
            res.status(200).json({ success: true, data: aluno });
        } catch (error) {
            next(error);
        }
    }
    
    static async update(req, res, next) {
        try {
            const aluno = await AlunoService.updateAluno(req.params.id, req.body);
            res.status(200).json({ success: true, data: aluno });
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            await AlunoService.deleteAluno(req.params.id);
            res.status(200).json({ success: true, message: 'Aluno deletado com sucesso' });
        } catch (error) {
            next(error);
        }
    }
    
    static async getByTurma(req, res, next) {
        try {
            const alunos = await AlunoService.getAlunosByTurma(req.params.id_turma);
            res.status(200).json({ success: true, data: alunos });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AlunoController;