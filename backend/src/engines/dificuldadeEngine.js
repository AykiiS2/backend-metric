const facil = require('./regras/facil');
const media = require('./regras/media');
const dificil = require('./regras/dificil');

class DificuldadeEngine {
    constructor() {
        this.regras = { facil, media, dificil };
    }

    getRegras(nivel) {
        const niveis = {
            'facil': facil,
            'media': media,
            'dificil': dificil
        };
        
        if (!niveis[nivel]) {
            throw new Error(`Nível de dificuldade inválido: ${nivel}`);
        }
        
        return niveis[nivel];
    }

    validarOperacao(operacao, nivel) {
        const regras = this.getRegras(nivel);
        return regras.operacoesPermitidas.includes(operacao);
    }

    getNumerosRange(nivel) {
        const regras = this.getRegras(nivel);
        return regras.numerosRange;
    }

    getTotalContas(nivel) {
        const regras = this.getRegras(nivel);
        return regras.totalContas;
    }
}

module.exports = new DificuldadeEngine();