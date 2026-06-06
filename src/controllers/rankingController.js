const rankingService = require('../services/rankingService');

class RankingController {
  async atualizarRanking(req, res, next) {
    try {
      const { alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao } = req.body;

      if (!alunoId) {
        return res.status(400).json({ error: 'alunoId é obrigatório' });
      }
      if (!escolaId) {
        return res.status(400).json({ error: 'escolaId é obrigatório' });
      }
      if (!turmaId) {
        return res.status(400).json({ error: 'turmaId é obrigatório' });
      }
      if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'nome é obrigatório' });
      }
      if (pontuacao === undefined || pontuacao === null) {
        return res.status(400).json({ error: 'pontuacao é obrigatória' });
      }
      if (typeof pontuacao !== 'number' || pontuacao < 0 || pontuacao > 3000) {
        return res.status(400).json({ error: 'Pontuação inválida (deve estar entre 0 e 3000)' });
      }

      const resultado = await rankingService.atualizarRanking({
        alunoId,
        escolaId,
        turmaId,
        nome,
        codIdentificacao,
        pontuacao
      });

      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  async obterRanking(req, res, next) {
    try {
      const { escolaId, turmaId } = req.query;
      const ranking = await rankingService.obterRanking({ escolaId, turmaId });
      res.json({ success: true, ranking });
    } catch (error) {
      next(error);
    }
  }

  async obterPosicaoAluno(req, res, next) {
    try {
      const { alunoId } = req.params;
      if (!alunoId) {
        return res.status(400).json({ error: 'alunoId é obrigatório' });
      }
      const posicao = await rankingService.obterPosicaoAluno(alunoId);
      res.json({ success: true, posicao });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RankingController();
