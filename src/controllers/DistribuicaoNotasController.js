const distribuicaoNotasService = require('../services/DistribuicaoNotasService');

class DistribuicaoNotasController {
  async registrar(req, res, next) {
    try {
      const { notaConceitual, escolaId, turmaId, alunoId } = req.body;
      
      if (!notaConceitual || !escolaId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await distribuicaoNotasService.registrar({
        notaConceitual,
        escolaId,
        turmaId,
        alunoId
      });
      
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async obterDistribuicao(req, res, next) {
    try {
      const { escolaId, turmaId } = req.query;
      const distribuicao = await distribuicaoNotasService.obterDistribuicao({ escolaId, turmaId });
      res.json({ success: true, distribuicao });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DistribuicaoNotasController();
