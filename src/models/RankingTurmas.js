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
          periodo: 'Integral',
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
          id_turma: turmaId,
          nome_turma: nomeTurma,
          periodo: 'Integral',
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
      .select('*')
      .order('desempenho', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

module.exports = RankingTurmasModel;
