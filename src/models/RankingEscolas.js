const { getSupabaseAdmin } = require('../config/supabase');

class RankingEscolasModel {
  static async atualizarRanking({ escolaId, nomeEscola, mediaPercentual, quantidadeTurmas, quantidadeAlunos }) {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_escolas')
      .select('id')
      .eq('id_escola', escolaId)
      .maybeSingle();

    if (findError) throw findError;

    if (existe) {
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .update({
          nome_escola: nomeEscola,
          desempenho: Math.round(mediaPercentual * 100)
        })
        .eq('id_escola', escolaId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .insert({
          id_escola: escolaId,
          nome_escola: nomeEscola,
          desempenho: Math.round(mediaPercentual * 100)
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
      .order('desempenho', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = RankingEscolasModel;
