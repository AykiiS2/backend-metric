const dificuldadeEngine = require('./dificuldadeEngine');
const pontuacaoEngine = require('./pontuacaoEngine');

class AvaliacaoEngine {
    constructor() {
        this.cacheResultados = new Map();
    }

    avaliar(nivel, tempoSegundos, totalErros, totalAcertos) {
        try {
            const regras = dificuldadeEngine.getRegras(nivel);
            const totalContas = regras.totalContas;
            
            const errosValidos = Math.min(totalErros, totalContas);
            const acertosValidos = Math.min(totalAcertos, totalContas);
            
            const validacao = this.validarDados(nivel, tempoSegundos, errosValidos, acertosValidos);
            if (!validacao.valido) {
                return {
                    success: false,
                    error: validacao.erro,
                    nota: null,
                    pontuacao: null
                };
            }
            
            const nota = this.determinarNota(nivel, tempoSegundos, errosValidos, acertosValidos);
            const pontuacao = pontuacaoEngine.calcularPontuacao(nota, tempoSegundos, errosValidos, acertosValidos);
            
            const resultado = {
                success: true,
                nota,
                pontuacao: pontuacao.pontuacaoFinal,
                detalhes: {
                    nivel,
                    tempoSegundos,
                    totalErros: errosValidos,
                    totalAcertos: acertosValidos,
                    totalContas,
                    percentualAcerto: (acertosValidos / totalContas * 100).toFixed(2),
                    ...pontuacao
                }
            };
            
            const cacheKey = `${nivel}_${tempoSegundos}_${errosValidos}_${acertosValidos}`;
            this.cacheResultados.set(cacheKey, resultado);
            
            return resultado;
            
        } catch (error) {
            return {
                success: false,
                error: error.message,
                nota: null,
                pontuacao: null
            };
        }
    }

    determinarNota(nivel, tempoSegundos, erros, acertos) {
        const regras = dificuldadeEngine.getRegras(nivel);
        const limites = regras.limites;
        
        if (this.verificarMB(limites, tempoSegundos, erros, acertos)) return 'MB';
        if (this.verificarB(limites, tempoSegundos, erros, acertos)) return 'B';
        if (this.verificarR(limites, tempoSegundos, erros, acertos)) return 'R';
        return 'I';
    }

    verificarMB(limites, tempoSegundos, erros, acertos) {
        const mb = limites.MB;
        
        const tempoOk = tempoSegundos <= mb.tempoMaxSegundos;
        const errosOk = erros <= mb.errosMaximos;
        const acertosOk = acertos >= mb.acertosMinimos;
        
        if (mb.tempoMinSegundos) {
            return tempoOk && errosOk && acertosOk;
        }
        
        return tempoOk && errosOk && acertosOk;
    }

    verificarB(limites, tempoSegundos, erros, acertos) {
        const b = limites.B;
        
        const tempoOk = tempoSegundos <= b.tempoMaxSegundos;
        const errosOk = erros <= b.errosMaximos;
        const acertosOk = acertos >= b.acertosMinimos;
        
        if (this.verificarMB(limites, tempoSegundos, erros, acertos)) return false;
        
        return tempoOk && errosOk && acertosOk;
    }

    verificarR(limites, tempoSegundos, erros, acertos) {
        const r = limites.R;
        
        const tempoOk = tempoSegundos <= r.tempoMaxSegundos;
        const errosOk = erros <= r.errosMaximos;
        const acertosOk = acertos >= r.acertosMinimos;
        
        if (this.verificarMB(limites, tempoSegundos, erros, acertos)) return false;
        if (this.verificarB(limites, tempoSegundos, erros, acertos)) return false;
        
        return tempoOk && errosOk && acertosOk;
    }

    validarDados(nivel, tempoSegundos, erros, acertos) {
        const regras = dificuldadeEngine.getRegras(nivel);
        const totalContas = regras.totalContas;
        
        if (typeof tempoSegundos !== 'number' || tempoSegundos <= 0) {
            return { valido: false, erro: 'Tempo inválido' };
        }
        
        if (typeof erros !== 'number' || erros < 0) {
            return { valido: false, erro: 'Número de erros inválido' };
        }
        
        if (typeof acertos !== 'number' || acertos < 0) {
            return { valido: false, erro: 'Número de acertos inválido' };
        }
        
        if (erros + acertos !== totalContas) {
            return { 
                valido: false, 
                erro: `Soma de erros (${erros}) e acertos (${acertos}) não corresponde ao total de contas (${totalContas})` 
            };
        }
        
        return { valido: true };
    }

    calcularEstatisticas(avaliacoes) {
        if (!avaliacoes || avaliacoes.length === 0) {
            return {
                mediaNota: null,
                mediaPontuacao: 0,
                distribuicao: { MB: 0, B: 0, R: 0, I: 0 },
                totalAvaliacoes: 0
            };
        }
        
        const distribuicao = { MB: 0, B: 0, R: 0, I: 0 };
        let somaPontuacao = 0;
        
        for (const avaliacao of avaliacoes) {
            if (avaliacao.success && avaliacao.nota) {
                distribuicao[avaliacao.nota]++;
                somaPontuacao += avaliacao.pontuacao;
            }
        }
        
        const pesos = { MB: 4, B: 3, R: 2, I: 1 };
        let somaPesos = 0;
        let totalValidos = 0;
        
        for (const [nota, quantidade] of Object.entries(distribuicao)) {
            somaPesos += pesos[nota] * quantidade;
            totalValidos += quantidade;
        }
        
        const mediaNota = totalValidos > 0 ? somaPesos / totalValidos : null;
        
        return {
            mediaNota,
            mediaPontuacao: totalValidos > 0 ? somaPontuacao / totalValidos : 0,
            distribuicao,
            totalAvaliacoes: avaliacoes.length,
            totalValidas: totalValidos
        };
    }

    limparCache() {
        this.cacheResultados.clear();
    }

    getCacheSize() {
        return this.cacheResultados.size;
    }
}

module.exports = new AvaliacaoEngine();