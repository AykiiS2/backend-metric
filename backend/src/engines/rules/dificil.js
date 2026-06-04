module.exports = {
    nivel: 'Difícil',
    totalContas: 63,
    limites: {
        MB: {
            tempoMaxSegundos: 300,
            errosMaximos: 7,
            acertosMinimos: 56
        },
        B: {
            tempoMaxSegundos: 420,
            errosMaximos: 13,
            acertosMinimos: 50
        },
        R: {
            tempoMaxSegundos: 540,
            errosMaximos: 22,
            acertosMinimos: 41
        },
        I: {
            tempoMinSegundos: 541,
            errosMinimos: 23,
            acertosMaximos: 40
        }
    },
    operacoesPermitidas: ['multiplicacao', 'divisao', 'soma', 'subtracao', 'parenteses', 'negativo'],
    numerosRange: [1, 20]
};