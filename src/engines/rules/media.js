module.exports = {
    nivel: 'Média',
    totalContas: 63,
    limites: {
        MB: {
            tempoMaxSegundos: 240,
            errosMaximos: 5,
            acertosMinimos: 58
        },
        B: {
            tempoMaxSegundos: 360,
            errosMaximos: 10,
            acertosMinimos: 53
        },
        R: {
            tempoMaxSegundos: 480,
            errosMaximos: 18,
            acertosMinimos: 45
        },
        I: {
            tempoMinSegundos: 481,
            errosMinimos: 19,
            acertosMaximos: 44
        }
    },
    operacoesPermitidas: ['multiplicacao', 'divisao', 'soma', 'subtracao'],
    numerosRange: [1, 10]
};