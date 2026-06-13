const rankingEscolasService = require('../services/rankingEscolasService');

class RankingEscolasController {
  async atualizar(req, res, next) {
    try {
      const { escolaId, nomeEscola, mediaPercentual, quantidadeTurmas, quantidadeAlunos } = req.body;
      
      if (!escolaId || !nomeEscola) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await rankingEscolasService.atualizarRanking({
        escolaId,
        nomeEscola,
        mediaPercentual: mediaPercentual || 0,
        quantidadeTurmas: quantidadeTurmas || 0,
        quantidadeAlunos: quantidadeAlunos || 0
      });
      
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }
  
  async obterRanking(req, res, next) {
    try {
      const ranking = await rankingEscolasService.obterRanking();
      res.json({ success: true, ranking });
    } catch (error) {
      next(error);
    }
  }

  async obterMelhorEscola(req, res, next) {
    try {
      const melhorEscola = await rankingEscolasService.obterMelhorEscola();
      res.json({ success: true, data: melhorEscola });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RankingEscolasController();
