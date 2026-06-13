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

  async obterMelhorTurma(escolaId) {
    const ranking = await RankingTurmasModel.obterRanking(escolaId);
    if (!ranking || ranking.length === 0) return null;
    
    const melhor = ranking[0];
    return {
      turmaId: melhor.id_turma,
      nomeTurma: melhor.nome_turma,
      periodo: melhor.periodo,
      desempenho: melhor.desempenho,
      posicao: 1
    };
  }
}

module.exports = new RankingTurmasService();
