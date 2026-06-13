const xss = require('xss');

function sanitizeInput(input) {
    if (typeof input === 'string') {
        return xss(input.trim());
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = sanitizeInput(value);
        }
        return sanitized;
    }
    return input;
}

function validateSQLInjection(str) {
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|OR|AND)\b|\-\-|\;|\|\||&&)/i;
    if (typeof str === 'string' && sqlPattern.test(str)) {
        throw new Error('Conteúdo não permitido detectado');
    }
    return true;
}

function sanitizeEmail(email) {
    return email.toLowerCase().trim();
}

function sanitizePhone(phone) {
    return phone.replace(/[^\d+]/g, '');
}

module.exports = { sanitizeInput, validateSQLInjection, sanitizeEmail, sanitizePhone };