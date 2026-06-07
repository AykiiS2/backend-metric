const Escola = require('../models/Escola');

class EscolaService {
    static async createEscola(escolaData) {
        const existingEscola = await Escola.findAll();
        const nameExists = existingEscola.some(e => e.nome_escola === escolaData.nome_escola);
        
        if (nameExists) throw new Error('Escola já cadastrada');
        
        return await Escola.create(escolaData);
    }
    
    static async getAllEscolas() {
        return await Escola.findAll();
    }
    
    static async getEscolaById(id) {
        const escola = await Escola.findById(id);
        if (!escola) throw new Error('Escola não encontrada');
        return escola;
    }
    
    static async updateEscola(id, escolaData) {
        const existingEscola = await Escola.findById(id);
        if (!existingEscola) throw new Error('Escola não encontrada');
        
        if (escolaData.nome_escola) {
            const escolas = await Escola.findAll();
            const nameExists = escolas.some(e => e.nome_escola === escolaData.nome_escola && e.id_escola !== id);
            if (nameExists) throw new Error('Nome de escola já existe');
        }
        
        return await Escola.update(id, escolaData);
    }
    
    static async deleteEscola(id) {
        const existingEscola = await Escola.findById(id);
        if (!existingEscola) throw new Error('Escola não encontrada');
        
        const turmas = await Escola.getTurmas(id);
        if (turmas.length > 0) throw new Error('Não é possível excluir escola com turmas vinculadas');
        
        const alunos = await Escola.getAlunos(id);
        if (alunos.length > 0) throw new Error('Não é possível excluir escola com alunos vinculados');
        
        return await Escola.delete(id);
    }
    
    static async getTurmasFromEscola(id_escola) {
        const escola = await Escola.findById(id_escola);
        if (!escola) throw new Error('Escola não encontrada');
        return await Escola.getTurmas(id_escola);
    }
    
    static async getAlunosFromEscola(id_escola) {
        const escola = await Escola.findById(id_escola);
        if (!escola) throw new Error('Escola não encontrada');
        return await Escola.getAlunos(id_escola);
    }
}

module.exports = EscolaService;