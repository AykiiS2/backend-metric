const TurmaService = require('../services/turmaService');

class TurmaController {
    static async create(req, res, next) {
        try {
            const turma = await TurmaService.createTurma(req.body);
            res.status(201).json({ success: true, data: turma });
        } catch (error) {
            next(error);
        }
    }
    
    static async getAll(req, res, next) {
        try {
            const { id_escola, serie, periodo } = req.query;
            const filters = {};
            if (id_escola) filters.id_escola = parseInt(id_escola);
            if (serie) filters.serie = serie;
            if (periodo) filters.periodo = periodo;
            
            const turmas = await TurmaService.getAllTurmas(filters);
            res.status(200).json({ success: true, data: turmas });
        } catch (error) {
            next(error);
        }
    }
    
    static async getById(req, res, next) {
        try {
            const turma = await TurmaService.getTurmaById(parseInt(req.params.id));
            res.status(200).json({ success: true, data: turma });
        } catch (error) {
            next(error);
        }
    }
    
    static async update(req, res, next) {
        try {
            const turma = await TurmaService.updateTurma(parseInt(req.params.id), req.body);
            res.status(200).json({ success: true, data: turma });
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            await TurmaService.deleteTurma(parseInt(req.params.id));
            res.status(200).json({ success: true, message: 'Turma deletada com sucesso' });
        } catch (error) {
            next(error);
        }
    }
    
    static async getAlunos(req, res, next) {
        try {
            const alunos = await TurmaService.getAlunosFromTurma(parseInt(req.params.id));
            res.status(200).json({ success: true, data: alunos });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TurmaController;