const RankingEscolasModel = require('../models/RankingEscolas');

class RankingEscolasService {
  async atualizarDesempenho(escolaId, nomeEscola, notaConceitual) {
    if (!escolaId || !nomeEscola) {
      throw new Error('Dados incompletos');
    }
    return await RankingEscolasModel.atualizarDesempenho(escolaId, nomeEscola, notaConceitual);
  }
  
  async obterRanking() {
    return await RankingEscolasModel.obterRanking();
  }
}

module.exports = new RankingEscolasService();
