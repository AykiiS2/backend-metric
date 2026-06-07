const distribuicaoNotasService = require('../services/DistribuicaoNotasService');

class DistribuicaoNotasController {
  async registrar(req, res, next) {
    try {
      const { notaConceitual, escolaId } = req.body;
      
      if (!notaConceitual || !escolaId) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      
      const resultado = await distribuicaoNotasService.registrar(notaConceitual, escolaId);
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async obterDistribuicao(req, res, next) {
    try {
      const { escolaId } = req.query;
      const distribuicao = await distribuicaoNotasService.obterDistribuicao(escolaId);
      res.json({ success: true, distribuicao });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DistribuicaoNotasController();
