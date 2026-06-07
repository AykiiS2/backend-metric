const RankingTurmasModel = require('../models/RankingTurmas');

class RankingTurmasService {
  async atualizarRanking(dados) {
    const { turmaId, nomeTurma, escolaId, mediaPercentual, quantidadeAlunos } = dados;
    
    if (!turmaId || !nomeTurma || !escolaId) {
      throw new Error('Dados incompletos para atualizar ranking de turmas');
    }
    
    return await RankingTurmasModel.atualizarRanking({
      turmaId,
      nomeTurma,
      escolaId,
      mediaPercentual,
      quantidadeAlunos
    });
  }

  async obterRanking(escolaId) {
    return await RankingTurmasModel.obterRanking(escolaId);
  }
}

module.exports = new RankingTurmasService();
