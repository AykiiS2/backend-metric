function avaliarExpressao(expressao) {
    let expr = expressao.replace(/\s/g, '');
    
    expr = expr.replace(/:/g, '/');
    expr = expr.replace(/[xX]/g, '*');
    
    expr = expr.replace(/--/g, '+');
    expr = expr.replace(/-\+/g, '-');
    expr = expr.replace(/\+-/g, '-');
    expr = expr.replace(/\+\+/g, '+');
    
    if (expr.startsWith('-')) {
        expr = `0${expr}`;
    }
    
    try {
        if (!validarExpressao(expr)) {
            return null;
        }
        
        const resultado = Function(`"use strict"; return (${expr})`)();
        
        return Math.round(resultado * 100) / 100;
    } catch (error) {
        console.error('Erro ao avaliar expressão:', expr, error.message);
        return null;
    }
}

function validarExpressao(expr) {
    const regex = /^[0-9+\-*/()]+$/;
    
    let balance = 0;
    for (const char of expr) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) return false;
    }
    
    return regex.test(expr) && balance === 0;
}

function separarContaEResposta(texto) {
    const igualIndex = texto.lastIndexOf('=');
    
    if (igualIndex === -1) {
        return { expressao: texto, resposta: null };
    }
    
    let expressao = texto.substring(0, igualIndex);
    let respostaStr = texto.substring(igualIndex + 1);
    
    expressao = expressao.trim();
    respostaStr = respostaStr.trim();
    
    const respostaMatch = respostaStr.match(/-?\d+\.?\d*/);
    const resposta = respostaMatch ? parseFloat(respostaMatch[0]) : null;
    
    return { expressao, resposta };
}

function parseEquation(texto) {
    const textoLimpo = texto.replace(/\s/g, '');
    
    const { expressao, respostaUsuario } = separarContaEResposta(textoLimpo);
    
    if (!expressao || respostaUsuario === null) {
        return null;
    }
    
    const resultadoCorreto = avaliarExpressao(expressao);
    
    if (resultadoCorreto === null) {
        return {
            textoOriginal: texto,
            expressao,
            respostaUsuario,
            resultadoCorreto: null,
            correto: false,
            erro: 'Não foi possível avaliar a expressão'
        };
    }
    
    const estaCorreto = Math.abs(respostaUsuario - resultadoCorreto) < 0.01;
    
    return {
        textoOriginal: texto,
        expressao,
        respostaUsuario,
        resultadoCorreto,
        correto: estaCorreto
    };
}

function corrigirMultiplasEquacoes(equacoes) {
    const resultados = [];
    let totalAcertos = 0;
    let totalErros = 0;
    
    for (const equacao of equacoes) {
        const parsed = parseEquation(equacao);
        if (parsed && !parsed.erro) {
            resultados.push(parsed);
            if (parsed.correto) {
                totalAcertos++;
            } else {
                totalErros++;
            }
        }
    }
    
    const total = resultados.length;
    
    return {
        success: true,
        totalEquacoes: total,
        totalAcertos,
        totalErros,
        percentualAcerto: total > 0 ? (totalAcertos / total * 100).toFixed(2) : 0,
        resultados
    };
}

module.exports = {
    avaliarExpressao,
    parseEquation,
    corrigirMultiplasEquacoes,
    separarContaEResposta
};