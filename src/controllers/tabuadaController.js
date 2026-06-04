const tabuadaService = require('../services/tabuadaService');
const { corrigirMultiplasEquacoes } = require('../services/mathCorrectorService');

async function avaliarTabuada(req, res) {
    try {
        const { nivel, tempoSegundos, equacoes } = req.body;
        
        if (!nivel) {
            return res.status(400).json({
                success: false,
                error: 'Nível não informado'
            });
        }
        
        if (!tabuadaService.validarNivel(nivel)) {
            return res.status(400).json({
                success: false,
                error: `Nível inválido. Níveis válidos: facil, media, dificil`
            });
        }
        
        if (!tempoSegundos || typeof tempoSegundos !== 'number' || tempoSegundos <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Tempo inválido'
            });
        }
        
        if (!equacoes || !Array.isArray(equacoes) || equacoes.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Lista de equações não fornecida'
            });
        }
        
        const correcao = corrigirMultiplasEquacoes(equacoes);
        
        const resultado = tabuadaService.processarResultado(
            nivel,
            tempoSegundos,
            correcao.resultados
        );
        
        if (!resultado.success) {
            return res.status(422).json(resultado);
        }
        
        return res.json(resultado);
        
    } catch (error) {
        console.error('Erro na avaliação:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getInfoNivel(req, res) {
    try {
        const { nivel } = req.params;
        
        if (!nivel) {
            return res.status(400).json({
                success: false,
                error: 'Nível não informado'
            });
        }
        
        if (!tabuadaService.validarNivel(nivel)) {
            return res.status(400).json({
                success: false,
                error: `Nível inválido. Níveis válidos: facil, media, dificil`
            });
        }
        
        const info = tabuadaService.getInfoNivel(nivel);
        
        return res.json({
            success: true,
            info
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function iniciarSessao(req, res) {
    try {
        const { nivel, alunoId } = req.body;
        
        if (!nivel || !alunoId) {
            return res.status(400).json({
                success: false,
                error: 'Nível e alunoId são obrigatórios'
            });
        }
        
        if (!tabuadaService.validarNivel(nivel)) {
            return res.status(400).json({
                success: false,
                error: `Nível inválido. Níveis válidos: facil, media, dificil`
            });
        }
        
        const sessaoId = tabuadaService.criarSessao(nivel, alunoId);
        
        return res.json({
            success: true,
            sessaoId,
            nivel,
            alunoId,
            totalContas: tabuadaService.getInfoNivel(nivel).totalContas
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function finalizarSessao(req, res) {
    try {
        const { sessaoId, equacoes } = req.body;
        
        if (!sessaoId) {
            return res.status(400).json({
                success: false,
                error: 'sessaoId é obrigatório'
            });
        }
        
        if (!equacoes || !Array.isArray(equacoes)) {
            return res.status(400).json({
                success: false,
                error: 'Lista de equações é obrigatória'
            });
        }
        
        const sessao = tabuadaService.getSessao(sessaoId);
        
        if (!sessao) {
            return res.status(404).json({
                success: false,
                error: 'Sessão não encontrada ou já finalizada'
            });
        }
        
        const correcao = corrigirMultiplasEquacoes(equacoes);
        
        const resultado = tabuadaService.finalizarSessao(sessaoId, correcao.resultados);
        
        return res.json(resultado);
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    avaliarTabuada,
    getInfoNivel,
    iniciarSessao,
    finalizarSessao
};