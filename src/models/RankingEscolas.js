const { getSupabaseAdmin } = require('../config/supabase');

class RankingEscolasModel {
  static async atualizarDesempenho(escolaId, nomeEscola, notaConceitual) {
    const supabaseAdmin = getSupabaseAdmin();
    
    let peso = 0;
    switch (notaConceitual) {
      case 'MB': peso = 4; break;
      case 'B': peso = 3; break;
      case 'R': peso = 2; break;
      case 'I': peso = 1; break;
      default: peso = 0;
    }
    
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_escolas')
      .select('id, desempenho')
      .eq('id_escola', escolaId)
      .maybeSingle();
    
    if (findError) throw findError;
    
    if (existe) {
      const novoDesempenho = existe.desempenho + peso;
      
      const { data, error } = await supabaseAdmin
        .from('ranking_escolas')
        .update({
          desempenho: novoDesempenho,
          nome_escola: nomeEscola
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
          desempenho: peso
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
