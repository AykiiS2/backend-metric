const { supabaseAdmin } = require('../config/supabase');

class RankingModel {
  static async atualizarRanking({ alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao }) {
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_ranking')
      .eq('id_aluno', alunoId)
      .maybeSingle();

    if (findError) throw findError;

    if (existe) {
      const { data, error } = await supabaseAdmin
        .from('ranking_alunos')
        .update({
          pontuacao,
          nome,
          cod_identificacao: codIdentificacao,
          ultima_atualizacao: new Date()
        })
        .eq('id_aluno', alunoId)
        .select();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('ranking_alunos')
        .insert({
          id_aluno: alunoId,
          id_escola: escolaId,
          id_turma: turmaId,
          nome,
          cod_identificacao: codIdentificacao,
          pontuacao,
          ultima_atualizacao: new Date()
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  static async registrarHistorico({ alunoId, codIdentificacao, pontuacao, acertos, erros, tempoSegundos }) {
    const { data, error } = await supabaseAdmin
      .from('historico_correcoes')
      .insert({
        id_aluno: alunoId,
        cod_identificacao: codIdentificacao,
        pontuacao,
        acertos,
        erros,
        tempo_segundos: tempoSegundos,
        created_at: new Date()
      })
      .select();

    if (error) throw error;
    return data;
  }

  static async obterRanking({ escolaId, turmaId }) {
    let query = supabaseAdmin
      .from('ranking_alunos')
      .select('*')
      .order('pontuacao', { ascending: false });

    if (escolaId) query = query.eq('id_escola', escolaId);
    if (turmaId) query = query.eq('id_turma', turmaId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async obterPosicaoAluno(alunoId) {
    const { data: allRanking, error } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_aluno, pontuacao')
      .order('pontuacao', { ascending: false });

    if (error) throw error;

    const posicao = allRanking.findIndex(item => item.id_aluno === alunoId) + 1;
    const aluno = allRanking.find(item => item.id_aluno === alunoId);

    return {
      posicao: posicao > 0 ? posicao : null,
      pontuacao: aluno?.pontuacao || 0
    };
  }
}

module.exports = RankingModel;