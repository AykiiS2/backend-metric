const { getSupabaseAdmin } = require('../config/supabase');

class RankingModel {
  static async atualizarRanking({ alunoId, escolaId, turmaId, nome, codIdentificacao, pontuacao, tempo }) {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_ranking, pontuacao, tempo')
      .eq('id_aluno', alunoId)
      .maybeSingle();

    if (findError) throw findError;

    const tempoAtualEmSegundos = _tempoParaSegundos(tempo);
    const tempoExistenteEmSegundos = existe ? _tempoParaSegundos(existe.tempo) : null;
    const melhorTempo = !existe || (tempoAtualEmSegundos < tempoExistenteEmSegundos);

    if (existe) {
      const novaPontuacao = (existe.pontuacao || 0) + pontuacao;
      
      const dadosAtualizacao = {
        pontuacao: novaPontuacao,
        nome,
        cod_identificacao: codIdentificacao,
        updated_at: new Date()
      };
      
      if (melhorTempo) {
        dadosAtualizacao.tempo = tempo;
      }
      
      const { data, error } = await supabaseAdmin
        .from('ranking_alunos')
        .update(dadosAtualizacao)
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
          pontuacao: pontuacao,
          tempo: tempo,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  static async obterRanking({ escolaId, turmaId }) {
    const supabaseAdmin = getSupabaseAdmin();
    
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
    const supabaseAdmin = getSupabaseAdmin();
    
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

function _tempoParaSegundos(tempo) {
  if (!tempo) return 999999;
  const partes = tempo.split(':');
  if (partes.length !== 2) return 999999;
  const minutos = parseInt(partes[0]) || 0;
  const segundos = parseInt(partes[1]) || 0;
  return (minutos * 60) + segundos;
}

module.exports = RankingModel;
