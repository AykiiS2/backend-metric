const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

async function hashData(data) {
    return await bcrypt.hash(data, SALT_ROUNDS);
}

async function compareHash(data, hash) {
    return await bcrypt.compare(data, hash);
}

function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

function maskSensitiveData(data) {
    if (!data) return null;
    if (typeof data === 'string' && data.includes('@')) {
        const [username, domain] = data.split('@');
        const maskedUsername = username.slice(0, 2) + '***' + username.slice(-2);
        return `${maskedUsername}@${domain}`;
    }
    if (typeof data === 'string' && data.length > 4) {
        return '*'.repeat(data.length - 4) + data.slice(-4);
    }
    return data;
}

module.exports = { hashData, compareHash, generateToken, maskSensitiveData };