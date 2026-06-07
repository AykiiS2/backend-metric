const DistribuicaoNotasModel = require('../models/DistribuicaoNotas');

class DistribuicaoNotasService {
  async registrar(notaConceitual, escolaId) {
    if (!notaConceitual || !escolaId) {
      throw new Error('Dados incompletos para registrar distribuição');
    }
    return await DistribuicaoNotasModel.registrar(notaConceitual, escolaId);
  }

  async obterDistribuicao(escolaId) {
    return await DistribuicaoNotasModel.obterDistribuicao(escolaId);
  }

  async limparTodas() {
    return await DistribuicaoNotasModel.limparTodas();
  }
}

module.exports = new DistribuicaoNotasService();
