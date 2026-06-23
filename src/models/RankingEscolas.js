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
          desempenho:  Math.round(mediaPercentual * 100)
        })
        .eq('id_escola', escolaId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .insert({
          id_escola:   escolaId,
          nome_escola: nomeEscola,
          desempenho:  Math.round(mediaPercentual * 100)
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  static async obterRanking() {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: escolas, error } = await supabaseAdmin
      .from('ranking_escolas')
      .select('id, id_escola, nome_escola, desempenho')
      .order('desempenho', { ascending: false });

    if (error) throw error;
    if (!escolas || !escolas.length) return [];

    const escolaIds = escolas.map(e => e.id_escola).filter(Boolean);
    const { data: contagens, error: countError } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_escola')
      .in('id_escola', escolaIds);

    if (countError) throw countError;

    const contagemMap = {};
    (contagens || []).forEach(r => {
      contagemMap[r.id_escola] = (contagemMap[r.id_escola] || 0) + 1;
    });

    return escolas.map(e => ({
      ...e,
      quantidade_alunos: contagemMap[e.id_escola] || 0
    }));
  }
}

module.exports = RankingEscolasModel;
