const rankingTurmasService = require('../services/rankingTurmasService');

class RankingTurmasController {
  async atualizar(req, res, next) {
    try {
      const { turmaId, nomeTurma, escolaId, mediaPercentual, quantidadeAlunos } = req.body;
      
      if (!turmaId || !nomeTurma || !escolaId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await rankingTurmasService.atualizarRanking({
        turmaId,
        nomeTurma,
        escolaId,
        mediaPercentual: mediaPercentual || 0,
        quantidadeAlunos: quantidadeAlunos || 0
      });
      
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }
  
  async obterRanking(req, res, next) {
    try {
      const { escolaId } = req.query;
      const ranking = await rankingTurmasService.obterRanking(escolaId);
      res.json({ success: true, ranking });
    } catch (error) {
      next(error);
    }
  }

  async obterMelhorTurma(req, res, next) {
    try {
      const { escolaId } = req.query;
      const melhorTurma = await rankingTurmasService.obterMelhorTurma(escolaId);
      res.json({ success: true, data: melhorTurma });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RankingTurmasController();
