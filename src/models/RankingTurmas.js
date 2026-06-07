const { getSupabaseAdmin } = require('../config/supabase');

class RankingTurmasModel {
  static async atualizarDesempenho(turmaId, nomeTurma, periodo, notaConceitual) {
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
      .from('ranking_turmas')
      .select('id, desempenho')
      .eq('id_turma', turmaId)
      .maybeSingle();
    
    if (findError) throw findError;
    
    if (existe) {
      const novoDesempenho = existe.desempenho + peso;
      
      const { data, error } = await supabaseAdmin
        .from('ranking_turmas')
        .update({
          desempenho: novoDesempenho,
          nome_turma: nomeTurma,
          periodo: periodo
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
          periodo: periodo,
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
      .from('ranking_turmas')
      .select('*')
      .order('desempenho', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

module.exports = RankingTurmasModel;
