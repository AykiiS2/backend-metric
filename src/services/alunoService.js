const Aluno = require('../models/Aluno');
const Turma = require('../models/Turma');
const Escola = require('../models/Escola');
const { validateEmail, validatePhone, validateDate } = require('../utils/validators');
const { sanitizeEmail, sanitizePhone } = require('../utils/sanitize');

class AlunoService {
    static async createAluno(alunoData) {
        const idTurma = parseInt(alunoData.id_turma);
        const turma = await Turma.findById(idTurma);
        if (!turma) throw new Error('Turma não encontrada');
        
        if (alunoData.email) {
            alunoData.email = sanitizeEmail(alunoData.email);
            if (!validateEmail(alunoData.email)) throw new Error('Email inválido');
        }
        
        if (alunoData.contato) {
            alunoData.contato = sanitizePhone(alunoData.contato);
            if (!validatePhone(alunoData.contato)) throw new Error('Contato inválido');
        }
        
        if (alunoData.data_nascimento && !validateDate(alunoData.data_nascimento)) {
            throw new Error('Data de nascimento inválida');
        }
        
        const mappedData = {
            nome: alunoData.nome_aluno,
            cod_identificacao: alunoData.rm,
            email: alunoData.email || null,
            contato: alunoData.contato || null,
            data_nascimento: alunoData.data_nascimento,
            id_escola: turma.id_escola,
            id_turma: idTurma,
        };
        
        return await Aluno.create(mappedData);
    }
    
    static async getAllAlunos(filters) {
        const parsedFilters = {};
        if (filters.id_escola) parsedFilters.id_escola = parseInt(filters.id_escola);
        if (filters.id_turma) parsedFilters.id_turma = parseInt(filters.id_turma);
        return await Aluno.findAll(parsedFilters);
    }
    
    static async getAlunoById(id) {
        const parsedId = parseInt(id);
        console.log('getAlunoById - ID original:', id, 'Parseado:', parsedId);
        if (isNaN(parsedId)) throw new Error('ID inválido');
        const aluno = await Aluno.findById(parsedId);
        if (!aluno) throw new Error('Aluno não encontrado');
        return aluno;
    }
    
    static async updateAluno(id, alunoData) {
        const parsedId = parseInt(id);
        console.log('updateAluno - ID original:', id, 'Parseado:', parsedId);
        if (isNaN(parsedId)) throw new Error('ID inválido');
        
        const existingAluno = await Aluno.findById(parsedId);
        if (!existingAluno) throw new Error('Aluno não encontrado');
        
        if (alunoData.id_turma) {
            const idTurma = parseInt(alunoData.id_turma);
            const turma = await Turma.findById(idTurma);
            if (!turma) throw new Error('Turma não encontrada');
        }
        
        if (alunoData.email) {
            alunoData.email = sanitizeEmail(alunoData.email);
            if (!validateEmail(alunoData.email)) throw new Error('Email inválido');
        }
        
        if (alunoData.contato) {
            alunoData.contato = sanitizePhone(alunoData.contato);
            if (!validatePhone(alunoData.contato)) throw new Error('Contato inválido');
        }
        
        const mappedData = {};
        if (alunoData.nome_aluno) mappedData.nome = alunoData.nome_aluno;
        if (alunoData.rm) mappedData.cod_identificacao = alunoData.rm;
        if (alunoData.email !== undefined) mappedData.email = alunoData.email || null;
        if (alunoData.contato !== undefined) mappedData.contato = alunoData.contato || null;
        if (alunoData.data_nascimento) mappedData.data_nascimento = alunoData.data_nascimento;
        if (alunoData.id_turma) mappedData.id_turma = parseInt(alunoData.id_turma);
        
        return await Aluno.update(parsedId, mappedData);
    }
    
    static async deleteAluno(id) {
        const parsedId = parseInt(id);
        console.log('==========================================');
        console.log('deleteAluno - ID original:', id, 'Tipo:', typeof id);
        console.log('deleteAluno - ID parseado:', parsedId, 'isNaN:', isNaN(parsedId));
        console.log('==========================================');
        
        if (isNaN(parsedId)) {
            throw new Error('ID inválido para exclusão: ' + id);
        }
        
        const existingAluno = await Aluno.findById(parsedId);
        if (!existingAluno) throw new Error('Aluno não encontrado');
        
        return await Aluno.delete(parsedId);
    }
    
    static async getAlunosByTurma(id_turma) {
        const parsedId = parseInt(id_turma);
        if (isNaN(parsedId)) throw new Error('ID da turma inválido');
        const turma = await Turma.findById(parsedId);
        if (!turma) throw new Error('Turma não encontrada');
        return await Aluno.findByTurma(parsedId);
    }
}

module.exports = AlunoService;