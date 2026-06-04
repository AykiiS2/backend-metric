module.exports = {
    nivel: 'Fácil',
    totalContas: 63,
    limites: {
        MB: {
            tempoMaxSegundos: 180,
            errosMaximos: 3,
            acertosMinimos: 60
        },
        B: {
            tempoMaxSegundos: 300,
            errosMaximos: 8,
            acertosMinimos: 55
        },
        R: {
            tempoMaxSegundos: 420,
            errosMaximos: 15,
            acertosMinimos: 48
        },
        I: {
            tempoMinSegundos: 421,
            errosMinimos: 16,
            acertosMaximos: 47
        }
    },
    operacoesPermitidas: ['multiplicacao', 'divisao'],
    numerosRange: [1, 5]
};