const RankingTurmasModel = require('../models/RankingTurmas');
const { getSupabaseAdmin } = require('../config/supabase');

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
    // Busca turmas
    const turmas = await RankingTurmasModel.obterRanking(escolaId);
    if (!turmas || !turmas.length) return [];

    // Busca nomes das escolas para enriquecer a resposta
    const supabaseAdmin = getSupabaseAdmin();
    const escolaIds = [...new Set(turmas.map(t => t.id_escola).filter(Boolean))];

    let escolasMap = {};
    if (escolaIds.length) {
      const { data: escolas } = await supabaseAdmin
        .from('ranking_escolas')
        .select('id_escola, nome_escola')
        .in('id_escola', escolaIds);

      if (escolas) {
        escolas.forEach(e => { escolasMap[e.id_escola] = e.nome_escola; });
      }
    }

    // Injeta nome_escola em cada turma
    return turmas.map(t => ({
      ...t,
      nome_escola: escolasMap[t.id_escola] || ''
    }));
  }

  async obterMelhorTurma(escolaId) {
    const ranking = await this.obterRanking(escolaId);
    if (!ranking || ranking.length === 0) return null;

    const melhor = ranking[0];
    return {
      turmaId:   melhor.id_turma,
      nomeTurma: melhor.nome_turma,
      periodo:   melhor.periodo,
      desempenho: melhor.desempenho,
      posicao:   1
    };
  }
}

module.exports = new RankingTurmasService();
