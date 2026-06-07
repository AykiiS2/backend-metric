const rankingTurmasService = require('../services/rankingTurmasService');

class RankingTurmasController {
  async atualizar(req, res, next) {
    try {
      const { turmaId, nomeTurma, periodo, notaConceitual } = req.body;
      
      if (!turmaId || !nomeTurma || !periodo) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await rankingTurmasService.atualizarDesempenho(turmaId, nomeTurma, periodo, notaConceitual);
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }
  
  async obterRanking(req, res, next) {
    try {
      const ranking = await rankingTurmasService.obterRanking();
      res.json({ success: true, ranking });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RankingTurmasController();
