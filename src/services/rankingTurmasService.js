const RankingTurmasModel = require('../models/RankingTurmas');

class RankingTurmasService {
  async atualizarDesempenho(turmaId, nomeTurma, periodo, notaConceitual) {
    if (!turmaId || !nomeTurma || !periodo) {
      throw new Error('Dados incompletos');
    }
    return await RankingTurmasModel.atualizarDesempenho(turmaId, nomeTurma, periodo, notaConceitual);
  }
  
  async obterRanking() {
    return await RankingTurmasModel.obterRanking();
  }
}

module.exports = new RankingTurmasService();
