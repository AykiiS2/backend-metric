const rankingEscolasService = require('../services/rankingEscolasService');

class RankingEscolasController {
  async atualizar(req, res, next) {
    try {
      const { escolaId, nomeEscola, notaConceitual } = req.body;
      
      if (!escolaId || !nomeEscola) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await rankingEscolasService.atualizarDesempenho(escolaId, nomeEscola, notaConceitual);
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
}

module.exports = new RankingEscolasController();
