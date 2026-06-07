const RankingEscolasModel = require('../models/RankingEscolas');

class RankingEscolasService {
  async atualizarRanking(dados) {
    const { escolaId, nomeEscola, mediaPercentual, quantidadeTurmas, quantidadeAlunos } = dados;
    
    if (!escolaId || !nomeEscola) {
      throw new Error('Dados incompletos para atualizar ranking de escolas');
    }
    
    return await RankingEscolasModel.atualizarRanking({
      escolaId,
      nomeEscola,
      mediaPercentual,
      quantidadeTurmas,
      quantidadeAlunos
    });
  }

  async obterRanking() {
    return await RankingEscolasModel.obterRanking();
  }
}

module.exports = new RankingEscolasService();
