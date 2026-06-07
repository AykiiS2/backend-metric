const { getSupabaseAdmin } = require('../config/supabase');

class RankingEscolasModel {
  static async atualizarRanking({ escolaId, nomeEscola, mediaPercentual, quantidadeTurmas, quantidadeAlunos }) {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_escolas')
      .select('id')
      .eq('escola_id', escolaId)
      .maybeSingle();

    if (findError) throw findError;

    if (existe) {
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .update({
          nome_escola: nomeEscola,
          media_percentual: mediaPercentual,
          quantidade_turmas: quantidadeTurmas,
          quantidade_alunos: quantidadeAlunos,
          updated_at: new Date()
        })
        .eq('escola_id', escolaId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .insert({
          escola_id: escolaId,
          nome_escola: nomeEscola,
          media_percentual: mediaPercentual,
          quantidade_turmas: quantidadeTurmas,
          quantidade_alunos: quantidadeAlunos,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  static async obterRanking() {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('ranking_escolas')
      .select('*')
      .order('media_percentual', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = RankingEscolasModel;
