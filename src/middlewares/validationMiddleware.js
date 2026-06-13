const { sanitizeInput, validateSQLInjection } = require('../utils/sanitize');
const validators = require('../utils/validators');

function validateAluno(req, res, next) {
    try {
        console.log('=== VALIDATE ALUNO ===');
        console.log('Body recebido:', JSON.stringify(req.body, null, 2));
        
        const data = sanitizeInput(req.body);
        console.log('Dados sanitizados:', JSON.stringify(data, null, 2));
        
        if (!validators.validateNome(data.nome_aluno)) {
            console.log('FALHOU: nome_aluno inválido:', data.nome_aluno);
            return res.status(400).json({ error: 'Nome inválido (mínimo 3 caracteres)' });
        }
        
        if (!validators.validateCodIdentificacao(data.rm)) {
            console.log('FALHOU: rm inválido:', data.rm);
            return res.status(400).json({ error: 'RM (Registro de Matrícula) inválido' });
        }
        
        if (data.email && !validators.validateEmail(data.email)) {
            console.log('FALHOU: email inválido:', data.email);
            return res.status(400).json({ error: 'Email inválido' });
        }
        
        if (data.contato && !validators.validatePhone(data.contato)) {
            console.log('FALHOU: contato inválido:', data.contato);
            return res.status(400).json({ error: 'Contato inválido' });
        }
        
        if (data.data_nascimento && !validators.validateDate(data.data_nascimento)) {
            console.log('FALHOU: data_nascimento inválida:', data.data_nascimento);
            return res.status(400).json({ error: 'Data de nascimento inválida' });
        }
        
        if (!validators.validateId(data.id_turma)) {
            console.log('FALHOU: id_turma inválido:', data.id_turma, 'tipo:', typeof data.id_turma);
            return res.status(400).json({ error: 'ID da turma inválido' });
        }
        
        console.log('Todas as validações passaram!');
        validateSQLInjection(JSON.stringify(data));
        req.body = data;
        next();
    } catch (error) {
        console.log('ERRO no validateAluno:', error.message);
        return res.status(400).json({ error: 'Dados inválidos detectados' });
    }
}

function validateTurma(req, res, next) {
    try {
        console.log('validateTurma - Body recebido:', req.body);
        const data = sanitizeInput(req.body);
        console.log('validateTurma - Dados sanitizados:', data);
        
        if (!validators.validateNome(data.nome_turma)) {
            console.log('validateTurma - Nome inválido:', data.nome_turma);
            return res.status(400).json({ error: 'Nome da turma inválido' });
        }
        
        if (!validators.validateSerie(data.serie)) {
            console.log('validateTurma - Série inválida:', data.serie);
            return res.status(400).json({ error: 'Série inválida' });
        }
        
        if (!validators.validatePeriodo(data.periodo)) {
            console.log('validateTurma - Período inválido:', data.periodo);
            return res.status(400).json({ error: 'Período inválido' });
        }
        
        if (!validators.validateId(data.id_escola)) {
            console.log('validateTurma - ID escola inválido:', data.id_escola, typeof data.id_escola);
            return res.status(400).json({ error: 'ID da escola inválido' });
        }
        
        validateSQLInjection(JSON.stringify(data));
        req.body = data;
        next();
    } catch (error) {
        console.log('validateTurma - Erro:', error.message);
        return res.status(400).json({ error: 'Dados inválidos detectados' });
    }
}

function validateEscola(req, res, next) {
    try {
        const data = sanitizeInput(req.body);
        
        if (!validators.validateNome(data.nome_escola)) {
            return res.status(400).json({ error: 'Nome da escola inválido' });
        }
        
        if (data.descricao && data.descricao.length > 500) {
            return res.status(400).json({ error: 'Descrição muito longa (máximo 500 caracteres)' });
        }
        
        validateSQLInjection(JSON.stringify(data));
        req.body = data;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Dados inválidos detectados' });
    }
}

function validateIdParam(req, res, next) {
    console.log('validateIdParam chamado - URL:', req.originalUrl, 'Params:', req.params);
    const id = req.params.id;
    if (!validators.validateId(id)) {
        console.log('validateIdParam - ID inválido:', id);
        return res.status(400).json({ error: 'ID inválido' });
    }
    next();
}

module.exports = { validateAluno, validateTurma, validateEscola, validateIdParam };