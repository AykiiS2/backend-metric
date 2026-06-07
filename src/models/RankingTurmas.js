const { getSupabaseAdmin } = require('../config/supabase');

class RankingTurmasModel {
  static async atualizarRanking({ turmaId, nomeTurma, escolaId, mediaPercentual, quantidadeAlunos }) {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_turmas')
      .select('id')
      .eq('turma_id', turmaId)
      .maybeSingle();

    if (findError) throw findError;

    if (existe) {
      const { data, error } = await supabaseAdmin
        .from('ranking_turmas')
        .update({
          nome_turma: nomeTurma,
          escola_id: escolaId,
          media_percentual: mediaPercentual,
          quantidade_alunos: quantidadeAlunos,
          updated_at: new Date()
        })
        .eq('turma_id', turmaId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_turmas')
        .insert({
          turma_id: turmaId,
          nome_turma: nomeTurma,
          escola_id: escolaId,
          media_percentual: mediaPercentual,
          quantidade_alunos: quantidadeAlunos,
          created_at: new Date(),
          updated_at: new Date()
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
      .order('media_percentual', { ascending: false });

    if (escolaId) query = query.eq('escola_id', escolaId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

module.exports = RankingTurmasModel;
