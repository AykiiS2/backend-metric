const avaliacaoEngine = require('../engines/avaliacaoEngine');
const dificuldadeEngine = require('../engines/dificuldadeEngine');

class TabuadaService {
    constructor() {
        this.sessoesAtivas = new Map();
    }

    processarResultado(nivel, tempoSegundos, equacoesCorrigidas) {
        const totalContas = dificuldadeEngine.getTotalContas(nivel);
        const totalAcertos = equacoesCorrigidas.filter(e => e.correto).length;
        const totalErros = equacoesCorrigidas.filter(e => !e.correto).length;
        
        if (totalAcertos + totalErros !== totalContas) {
            return {
                success: false,
                error: `Número de contas processadas (${totalAcertos + totalErros}) não corresponde ao esperado (${totalContas})`,
                totalContasEsperado: totalContas,
                totalContasProcessadas: totalAcertos + totalErros
            };
        }
        
        const avaliacao = avaliacaoEngine.avaliar(nivel, tempoSegundos, totalErros, totalAcertos);
        
        return {
            success: true,
            avaliacao,
            estatisticas: {
                totalContas,
                totalAcertos,
                totalErros,
                percentualAcerto: (totalAcertos / totalContas * 100).toFixed(2)
            }
        };
    }

    validarNivel(nivel) {
        const niveisValidos = ['facil', 'media', 'dificil'];
        return niveisValidos.includes(nivel);
    }

    getInfoNivel(nivel) {
        if (!this.validarNivel(nivel)) {
            throw new Error(`Nível inválido: ${nivel}`);
        }
        
        const regras = dificuldadeEngine.getRegras(nivel);
        
        return {
            nivel: regras.nivel,
            totalContas: regras.totalContas,
            operacoesPermitidas: regras.operacoesPermitidas,
            numerosRange: regras.numerosRange
        };
    }

    criarSessao(nivel, alunoId) {
        const sessaoId = `${alunoId}_${Date.now()}`;
        
        this.sessoesAtivas.set(sessaoId, {
            sessaoId,
            nivel,
            alunoId,
            inicio: new Date(),
            equacoes: [],
            status: 'em_andamento'
        });
        
        return sessaoId;
    }

    finalizarSessao(sessaoId, equacoesCorrigidas) {
        const sessao = this.sessoesAtivas.get(sessaoId);
        
        if (!sessao) {
            return {
                success: false,
                error: 'Sessão não encontrada'
            };
        }
        
        const tempoFim = new Date();
        const tempoSegundos = Math.floor((tempoFim - sessao.inicio) / 1000);
        
        const resultado = this.processarResultado(sessao.nivel, tempoSegundos, equacoesCorrigidas);
        
        sessao.status = 'finalizado';
        sessao.fim = tempoFim;
        sessao.resultado = resultado;
        
        this.sessoesAtivas.delete(sessaoId);
        
        return resultado;
    }

    getSessao(sessaoId) {
        return this.sessoesAtivas.get(sessaoId);
    }
}

module.exports = new TabuadaService();