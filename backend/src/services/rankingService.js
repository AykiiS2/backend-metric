import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { Aluno } from '../models/Aluno.js';

const alunoModel = new Aluno();

const toSafeStudentEntry = (
  entry,
  studentId
) => {
  return {
    posicao: entry.posicao,
    nome_aluno: entry.nome_aluno,
    nome_turma:
      entry.nome_turma ?? 'Sem turma',
    pontuacao:
      Number(entry.pontuacao) || 0,
    is_current_user:
      String(entry.id_aluno) ===
      String(studentId)
  };
};

const buildSafeStudentRanking = (
  ranking,
  studentId
) => {
  const top3 = ranking
    .slice(0, 3)
    .map(
      entry =>
        toSafeStudentEntry(
          entry,
          studentId
        )
    );

  const currentStudent =
    ranking.find(
      entry =>
        String(entry.id_aluno) ===
        String(studentId)
    );

  return {
    top3,
    currentStudent:
      currentStudent
        ? toSafeStudentEntry(
            currentStudent,
            studentId
          )
        : null,
    totalParticipants:
      ranking.length
  };
};

export const rankingService = {
  async getSafeGeneralStudentRanking(
    studentId
  ) {
    if (!studentId) {
      throw new AppError(
        'Aluno autenticado não identificado',
        401
      );
    }

    const ranking =
      await alunoModel.getRanking();

    const result =
      buildSafeStudentRanking(
        ranking,
        studentId
      );

    if (!result.currentStudent) {
      throw new AppError(
        'Aluno autenticado não encontrado no ranking',
        404
      );
    }

    return result;
  },

  async getSafeClassStudentRanking(
    studentId,
    turmaId
  ) {
    if (!studentId) {
      throw new AppError(
        'Aluno autenticado não identificado',
        401
      );
    }

    if (!turmaId) {
      throw new AppError(
        'Turma não informada',
        400
      );
    }

    const ranking =
      await alunoModel.getRankingByTurma(
        turmaId
      );

    return buildSafeStudentRanking(
      ranking,
      studentId
    );
  },

  async getSafeSchoolStudentRanking(
    studentId,
    escolaId
  ) {
    if (!studentId) {
      throw new AppError(
        'Aluno autenticado não identificado',
        401
      );
    }

    if (!escolaId) {
      throw new AppError(
        'Escola não informada',
        400
      );
    }

    const ranking =
      await alunoModel.getRankingByEscola(
        escolaId
      );

    return buildSafeStudentRanking(
      ranking,
      studentId
    );
  },

  async getTurmaOptions() {
    const { data, error } =
      await supabase
        .from('turmas')
        .select(
          'id_turma, nome_turma, id_escola'
        )
        .order(
          'nome_turma',
          {
            ascending: true
          }
        );

    if (error) {
      throw new AppError(
        `Erro ao buscar turmas: ${error.message}`,
        400
      );
    }

    return (data || []).map(
      turma => ({
        id_turma:
          turma.id_turma,

        nome_turma:
          turma.nome_turma
            ?.toString() ??
          'Turma',

        id_escola:
          turma.id_escola
      })
    );
  },

  async getTurmaOptionsByEscola(
    studentId,
    escolaId
  ) {
    if (!studentId) {
      throw new AppError(
        'Aluno autenticado não identificado',
        401
      );
    }

    if (!escolaId) {
      throw new AppError(
        'Escola não informada',
        400
      );
    }

    const { data, error } =
      await supabase
        .from('turmas')
        .select(
          'id_turma, nome_turma, id_escola'
        )
        .eq(
          'id_escola',
          escolaId
        )
        .order(
          'nome_turma',
          {
            ascending: true
          }
        );

    if (error) {
      throw new AppError(
        `Erro ao buscar turmas da escola: ${error.message}`,
        400
      );
    }

    return (data || []).map(
      turma => ({
        id_turma:
          turma.id_turma,

        nome_turma:
          turma.nome_turma
            ?.toString() ??
          'Turma',

        id_escola:
          turma.id_escola
      })
    );
  },

  async getSchoolRanking() {
    const { data, error } =
      await supabase
        .from('ranking_escolas')
        .select(
          'id_escola, nome_escola, pontuacao_escolas, qtd_alunos, qtd_turmas'
        )
        .order(
          'pontuacao_escolas',
          {
            ascending: false
          }
        );

    if (error) {
      throw new AppError(
        `Erro ao buscar ranking de escolas: ${error.message}`,
        400
      );
    }

    return (data || []).map(
      (school, index) => ({
        posicao:
          index + 1,

        id_escola:
          school.id_escola,

        nome_escola:
          school.nome_escola
            ?.toString() ??
          'Escola',

        pontuacao:
          Number(
            school.pontuacao_escolas
          ) || 0,

        qtd_alunos:
          Number(
            school.qtd_alunos
          ) || 0,

        qtd_turmas:
          Number(
            school.qtd_turmas
          ) || 0
      })
    );
  }
};
