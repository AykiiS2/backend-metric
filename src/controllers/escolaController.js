const EscolaService = require('../services/escolaService');

class EscolaController {
    static async create(req, res, next) {
        try {
            const escola = await EscolaService.createEscola(req.body);
            res.status(201).json({ success: true, data: escola });
        } catch (error) {
            next(error);
        }
    }
    
    static async getAll(req, res, next) {
        try {
            const escolas = await EscolaService.getAllEscolas();
            res.status(200).json({ success: true, data: escolas });
        } catch (error) {
            next(error);
        }
    }
    
    static async getById(req, res, next) {
        try {
            const escola = await EscolaService.getEscolaById(parseInt(req.params.id));
            res.status(200).json({ success: true, data: escola });
        } catch (error) {
            next(error);
        }
    }
    
    static async update(req, res, next) {
        try {
            const escola = await EscolaService.updateEscola(parseInt(req.params.id), req.body);
            res.status(200).json({ success: true, data: escola });
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            await EscolaService.deleteEscola(parseInt(req.params.id));
            res.status(200).json({ success: true, message: 'Escola deletada com sucesso' });
        } catch (error) {
            next(error);
        }
    }
    
    static async getTurmas(req, res, next) {
        try {
            const turmas = await EscolaService.getTurmasFromEscola(parseInt(req.params.id));
            res.status(200).json({ success: true, data: turmas });
        } catch (error) {
            next(error);
        }
    }
    
    static async getAlunos(req, res, next) {
        try {
            const alunos = await EscolaService.getAlunosFromEscola(parseInt(req.params.id));
            res.status(200).json({ success: true, data: alunos });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EscolaController;