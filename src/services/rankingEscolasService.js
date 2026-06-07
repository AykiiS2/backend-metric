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

  async obterMelhorEscola() {
    const ranking = await RankingEscolasModel.obterRanking();
    if (!ranking || ranking.length === 0) return null;
    
    const melhor = ranking[0];
    return {
      escolaId: melhor.escola_id,
      nomeEscola: melhor.nome_escola,
      mediaPercentual: melhor.media_percentual,
      quantidadeTurmas: melhor.quantidade_turmas,
      quantidadeAlunos: melhor.quantidade_alunos,
      posicao: 1
    };
  }
}

module.exports = new RankingEscolasService();
