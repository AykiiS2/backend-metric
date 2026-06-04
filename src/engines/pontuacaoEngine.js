class PontuacaoEngine {
    constructor() {
        this.pesos = {
            MB: 100,
            B: 75,
            R: 50,
            I: 25
        };
    }

    calcularPontuacao(nota, tempoSegundos, erros, acertos) {
        const basePontos = this.pesos[nota] || 0;
        
        let bonus = 0;
        let penalidade = 0;
        
        if (nota === 'MB') {
            if (tempoSegundos < 120) bonus += 10;
            if (erros === 0) bonus += 15;
            if (acertos === 63) bonus += 20;
        } else if (nota === 'B') {
            if (tempoSegundos < 200) bonus += 5;
            if (erros <= 3) bonus += 8;
        } else if (nota === 'R') {
            if (erros > 15) penalidade += 5;
        } else if (nota === 'I') {
            if (erros > 25) penalidade += 10;
            if (acertos < 30) penalidade += 15;
        }
        
        let pontuacaoFinal = basePontos + bonus - penalidade;
        pontuacaoFinal = Math.max(0, Math.min(100, pontuacaoFinal));
        
        return {
            pontuacaoFinal,
            basePontos,
            bonus,
            penalidade,
            detalhes: {
                nota,
                tempoSegundos,
                erros,
                acertos
            }
        };
    }

    converterPontuacaoParaNota(pontuacao) {
        if (pontuacao >= 90) return 'MB';
        if (pontuacao >= 70) return 'B';
        if (pontuacao >= 45) return 'R';
        return 'I';
    }

    getPesoNota(nota) {
        return this.pesos[nota] || 0;
    }
}

module.exports = new PontuacaoEngine();