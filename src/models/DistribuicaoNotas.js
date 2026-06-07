const { getSupabaseAdmin } = require('../config/supabase');

class DistribuicaoNotasModel {
  static async registrar(notaConceitual, escolaId) {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('distribuicao_notas')
      .insert({
        nota_conceitual: notaConceitual,
        escola_id: escolaId,
        created_at: new Date()
      })
      .select();
    
    if (error) throw error;
    return data;
  }

  static async obterDistribuicao(escolaId) {
    const supabaseAdmin = getSupabaseAdmin();
    
    let query = supabaseAdmin
      .from('distribuicao_notas')
      .select('nota_conceitual');
    
    if (escolaId && escolaId !== 'todas') {
      query = query.eq('escola_id', escolaId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const distribuicao = {
      'MB': 0,
      'B': 0,
      'R': 0,
      'I': 0
    };
    
    for (const item of data) {
      distribuicao[item.nota_conceitual] = (distribuicao[item.nota_conceitual] || 0) + 1;
    }
    
    return distribuicao;
  }

  static async limparTodas() {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { error } = await supabaseAdmin
      .from('distribuicao_notas')
      .delete()
      .neq('id', 0);
    
    if (error) throw error;
    return true;
  }
}

module.exports = DistribuicaoNotasModel;
