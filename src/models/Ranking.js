const { getSupabaseAdmin } = require('../config/supabase');

class RankingModel {
  static async atualizarRanking({ alunoId, escolaId, turmaId, nomeEscola, nomeTurma, nome, codIdentificacao, pontuacao, tempo }) {
    const supabaseAdmin = getSupabaseAdmin();

    // Validação apenas na ESCRITA
    if (!nomeEscola || nomeEscola.trim() === '') {
      console.error('[RankingModel] nomeEscola ausente para alunoId:', alunoId);
      throw new Error('nomeEscola é obrigatório para atualizar o ranking');
    }
    if (!nomeTurma || nomeTurma.trim() === '') {
      console.error('[RankingModel] nomeTurma ausente para alunoId:', alunoId);
      throw new Error('nomeTurma é obrigatório para atualizar o ranking');
    }

    const { data: existe, error: findError } = await supabaseAdmin
      .from('ranking_alunos')
      .select('id_ranking, pontuacao, tempo')
      .eq('id_aluno', alunoId)
      .maybeSingle();

    if (findError) throw findError;

    const tempoAtualEmSegundos     = _tempoParaSegundos(tempo);
    const tempoExistenteEmSegundos = existe ? _tempoParaSegundos(existe.tempo) : null;
    const melhorTempo = !existe || (tempoAtualEmSegundos < tempoExistenteEmSegundos);

    if (existe) {
      const novaPontuacao = (existe.pontuacao || 0) + pontuacao;

      const dadosAtualizacao = {
        pontuacao:         novaPontuacao,
        nome,
        id_escola:         escolaId,   // ← corrigido: sempre atualiza os IDs
        id_turma:          turmaId,
        nome_escola:       nomeEscola,
        nome_turma:        nomeTurma,
        cod_identificacao: codIdentificacao,
      };

      if (melhorTempo) dadosAtualizacao.tempo = tempo;

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
          id_aluno:          alunoId,
          id_escola:         escolaId,
          id_turma:          turmaId,
          nome,
          nome_escola:       nomeEscola,
          nome_turma:        nomeTurma,
          cod_identificacao: codIdentificacao,
          pontuacao,
          tempo,
        })
        .select();

      if (error) throw error;
      return data;
    }
  }

  // SEM validação de nomeEscola/nomeTurma aqui — é só leitura
  static async obterRanking({ escolaId, turmaId } = {}) {
    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
      .from('ranking_alunos')
      .select('id_ranking, id_aluno, id_escola, id_turma, nome, nome_escola, nome_turma, cod_identificacao, pontuacao, tempo')
      .order('pontuacao', { ascending: false });

    if (escolaId) query = query.eq('id_escola', escolaId);
    if (turmaId)  query = query.eq('id_turma',  turmaId);

    const { data, error } = await query;
    if (error) throw error;

    // Log de registros com dados incompletos (não bloqueia a resposta)
    const incompletos = (data || []).filter(r => !r.nome_escola || !r.nome_turma);
    if (incompletos.length) {
      console.warn(
        `[RankingModel] ${incompletos.length} registro(s) sem nome_escola ou nome_turma:`,
        incompletos.map(r => ({ id_aluno: r.id_aluno, id_escola: r.id_escola, id_turma: r.id_turma }))
      );
    }

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
    const aluno   = allRanking.find(item => item.id_aluno === alunoId);

    return {
      posicao:   posicao > 0 ? posicao : null,
      pontuacao: aluno?.pontuacao || 0,
    };
  }
}

function _tempoParaSegundos(tempo) {
  if (!tempo) return 999999;
  const partes = tempo.split(':');
  if (partes.length !== 2) return 999999;
  return (parseInt(partes[0]) || 0) * 60 + (parseInt(partes[1]) || 0);
}

module.exports = RankingModel;
