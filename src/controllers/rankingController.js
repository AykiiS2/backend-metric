const rankingService = require('../services/rankingService');

class RankingController {
  async atualizarRanking(req, res, next) {
    try {
      const { alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao, tempo } = req.body;
      console.log('[RankingController] Atualizando ranking:', { alunoId, nome, codIdentificacao, pontuacao });

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
        pontuacao,
        tempo
      });

      console.log('[RankingController] Ranking atualizado com sucesso');
      res.json({ success: true, data: resultado });
    } catch (error) {
      console.error('[RankingController] Erro ao atualizar ranking:', error);
      next(error);
    }
  }

  async registrarHistorico(req, res, next) {
    try {
      const { alunoId, turmaId, escolaId, nome, codIdentificacao, acertos, erros, tempoSegundos, operacao, pontuacao, detalhesCorrecao } = req.body;
      console.log('[RankingController] Registrando histórico de correção:', { alunoId, codIdentificacao, acertos, erros });

      if (!alunoId) {
        return res.status(400).json({ error: 'alunoId é obrigatório' });
      }
      if (!turmaId) {
        return res.status(400).json({ error: 'turmaId é obrigatório' });
      }
      if (!escolaId) {
        return res.status(400).json({ error: 'escolaId é obrigatório' });
      }
      if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'nome é obrigatório' });
      }
      if (!codIdentificacao || codIdentificacao.trim() === '') {
        return res.status(400).json({ error: 'codIdentificacao é obrigatório' });
      }
      if (acertos === undefined || erros === undefined) {
        return res.status(400).json({ error: 'acertos e erros são obrigatórios' });
      }

      const resultado = await rankingService.registrarHistorico({
        alunoId,
        turmaId,
        escolaId,
        nome,
        codIdentificacao,
        acertos,
        erros,
        tempoSegundos,
        operacao,
        pontuacao,
        detalhesCorrecao
      });

      console.log('[RankingController] Histórico registrado com sucesso');
      res.status(201).json({ success: true, data: resultado });
    } catch (error) {
      console.error('[RankingController] Erro ao registrar histórico:', error);
      next(error);
    }
  }

  async obterRanking(req, res, next) {
    try {
      const { escolaId, turmaId } = req.query;
      console.log('[RankingController] Obtendo ranking:', { escolaId, turmaId });
      
      const ranking = await rankingService.obterRanking({ escolaId, turmaId });
      
      console.log('[RankingController] Ranking obtido com sucesso');
      res.json({ success: true, ranking });
    } catch (error) {
      console.error('[RankingController] Erro ao obter ranking:', error);
      next(error);
    }
  }

  async obterPosicaoAluno(req, res, next) {
    try {
      const { alunoId } = req.params;
      console.log('[RankingController] Obtendo posição do aluno:', alunoId);
      
      if (!alunoId) {
        return res.status(400).json({ error: 'alunoId é obrigatório' });
      }
      
      const posicao = await rankingService.obterPosicaoAluno(alunoId);
      
      console.log('[RankingController] Posição obtida com sucesso');
      res.json({ success: true, posicao });
    } catch (error) {
      console.error('[RankingController] Erro ao obter posição:', error);
      next(error);
    }
  }
}

module.exports = new RankingController();
