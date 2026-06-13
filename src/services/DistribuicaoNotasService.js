const DistribuicaoNotasModel = require('../models/DistribuicaoNotas');

class DistribuicaoNotasService {
  async registrar(dados) {
    const { notaConceitual, escolaId, turmaId, alunoId } = dados;
    
    if (!notaConceitual || !escolaId) {
      throw new Error('Dados incompletos para registrar distribuição');
    }
    
    return await DistribuicaoNotasModel.registrar({
      notaConceitual,
      escolaId,
      turmaId,
      alunoId
    });
  }

  async obterDistribuicao(filtros) {
    return await DistribuicaoNotasModel.obterDistribuicao(filtros);
  }

  async limparTodas() {
    return await DistribuicaoNotasModel.limparTodas();
  }
}

module.exports = new DistribuicaoNotasService();
