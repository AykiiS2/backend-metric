const Turma = require('../models/Turma');
const Escola = require('../models/Escola');
const { validateSerie, validatePeriodo } = require('../utils/validators');

class TurmaService {
    static async createTurma(turmaData) {
        console.log('createTurma recebeu:', JSON.stringify(turmaData));
        
        const escola = await Escola.findById(turmaData.id_escola);
        console.log('Escola encontrada:', escola ? 'sim' : 'não');
        if (!escola) throw new Error('Escola não encontrada');
        
        console.log('Serie:', turmaData.serie, 'Valida?', validateSerie(turmaData.serie));
        if (!validateSerie(turmaData.serie)) throw new Error('Série inválida');
        
        console.log('Periodo:', turmaData.periodo, 'Valido?', validatePeriodo(turmaData.periodo));
        if (!validatePeriodo(turmaData.periodo)) throw new Error('Período inválido');
        
        return await Turma.create(turmaData);
    }
    
    static async getAllTurmas(filters) {
        return await Turma.findAll(filters);
    }
    
    static async getTurmaById(id) {
        const turma = await Turma.findById(id);
        if (!turma) throw new Error('Turma não encontrada');
        return turma;
    }
    
    static async updateTurma(id, turmaData) {
        const existingTurma = await Turma.findById(id);
        if (!existingTurma) throw new Error('Turma não encontrada');
        
        if (turmaData.id_escola) {
            const escola = await Escola.findById(turmaData.id_escola);
            if (!escola) throw new Error('Escola não encontrada');
        }
        
        if (turmaData.serie && !validateSerie(turmaData.serie)) {
            throw new Error('Série inválida');
        }
        
        if (turmaData.periodo && !validatePeriodo(turmaData.periodo)) {
            throw new Error('Período inválido');
        }
        
        return await Turma.update(id, turmaData);
    }
    
    static async deleteTurma(id) {
        const existingTurma = await Turma.findById(id);
        if (!existingTurma) throw new Error('Turma não encontrada');
        
        const alunos = await Turma.getAlunos(id);
        if (alunos.length > 0) throw new Error('Não é possível excluir turma com alunos matriculados');
        
        return await Turma.delete(id);
    }
    
    static async getAlunosFromTurma(id_turma) {
        const turma = await Turma.findById(id_turma);
        if (!turma) throw new Error('Turma não encontrada');
        return await Turma.getAlunos(id_turma);
    }
}

module.exports = TurmaService;