const { getSupabaseAdmin } = require('../config/supabase');

class RankingTurmasModel {
  static async atualizarRanking({ turmaId, nomeTurma, escolaId, mediaPercentual, quantidadeAlunos }) {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_turmas')
      .select('id')
      .eq('id_turma', turmaId)
      .maybeSingle();

    if (findError) throw findError;

    if (existe) {
      const { data, error } = await supabaseAdmin
        .from('ranking_turmas')
        .update({
          nome_turma: nomeTurma,
          id_escola:  escolaId,
          periodo:    'Integral',
          desempenho: Math.round(mediaPercentual * 100)
        })
        .eq('id_turma', turmaId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_turmas')
        .insert({
          id_turma:   turmaId,
          nome_turma: nomeTurma,
          id_escola:  escolaId,
          periodo:    'Integral',
          desempenho: Math.round(mediaPercentual * 100)
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  static async obterRanking(escolaId) {
    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
      .from('ranking_turmas')
      .select('id, id_turma, id_escola, nome_turma, periodo, desempenho')
      .order('desempenho', { ascending: false });

    if (escolaId) query = query.eq('id_escola', escolaId);

    const { data: turmas, error } = await query;
    if (error) throw error;
    if (!turmas || !turmas.length) return [];

    const turmaIds = turmas.map(t => t.id_turma).filter(Boolean);
    const { data: contagens, error: countError } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_turma')
      .in('id_turma', turmaIds);

    if (countError) throw countError;

    const contagemMap = {};
    (contagens || []).forEach(r => {
      contagemMap[r.id_turma] = (contagemMap[r.id_turma] || 0) + 1;
    });

    return turmas.map(t => ({
      ...t,
      quantidade_alunos: contagemMap[t.id_turma] || 0
    }));
  }
}

module.exports = RankingTurmasModel;
