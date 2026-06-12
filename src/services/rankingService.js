const RankingModel = require('../models/Ranking');

class RankingService {
  async atualizarRanking(dados) {
    const { alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao, tempo } = dados;
    
    if (!alunoId || !escolaId || !turmaId || !nome) {
      throw new Error('Dados incompletos para atualizar ranking');
    }
    
    if (pontuacao < 0 || pontuacao > 3000) {
      throw new Error('Pontuação inválida');
    }
    
    return await RankingModel.atualizarRanking({
      alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao, tempo
    });
  }

  async registrarHistorico(dados) {
    const { alunoId, turmaId, escolaId, nome, codIdentificacao, acertos, erros, tempoSegundos, operacao, pontuacao, detalhesCorrecao } = dados;
    
    if (!alunoId || !turmaId || !escolaId || !nome || !codIdentificacao) {
      throw new Error('Dados incompletos para registrar histórico');
    }
    
    return await RankingModel.registrarHistorico({
      alunoId, turmaId, escolaId, nome, codIdentificacao, acertos, erros, tempoSegundos, operacao, pontuacao, detalhesCorrecao
    });
  }

  async obterRanking(filtros) {
    return await RankingModel.obterRanking(filtros);
  }

  async obterPosicaoAluno(alunoId) {
    if (!alunoId) throw new Error('alunoId é obrigatório');
    return await RankingModel.obterPosicaoAluno(alunoId);
  }
}

module.exports = new RankingService();
