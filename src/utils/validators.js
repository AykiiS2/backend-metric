function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return true;
    const cleaned = phone.replace(/[^\d+]/g, '');
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(cleaned);
}

function validateDate(date) {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
}

function validateNome(nome) {
    return nome && nome.length >= 3 && nome.length <= 100;
}

function validateCodIdentificacao(cod) {
    return cod && cod.length >= 3 && cod.length <= 50;
}

function validateSerie(serie) {
    return serie && serie.length >= 1 && serie.length <= 50;
}

function validatePeriodo(periodo) {
    const periodosValidos = ['manhã', 'tarde', 'noite', 'Manhã', 'Tarde', 'Noite'];
    return periodosValidos.includes(periodo);
}

function validateId(id) {
    if (!id) return false;
    if (typeof id === 'string') {
        if (id.includes('-')) {
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        }
        const num = Number(id);
        return Number.isInteger(num) && num > 0;
    }
    if (typeof id === 'number') {
        return Number.isInteger(id) && id > 0;
    }
    return false;
}

module.exports = {
    validateEmail,
    validatePhone,
    validateDate,
    validateNome,
    validateCodIdentificacao,
    validateSerie,
    validatePeriodo,
    validateId
};