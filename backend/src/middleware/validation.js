import { validationResult, body, param, query } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

export const idValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido')
    .toInt()
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail()
    .trim(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
];

export const alunoLoginValidation = [
  body('rm')
    .isString()
    .notEmpty()
    .withMessage('RM é obrigatório')
    .trim(),
  body('senha')
    .isString()
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

export const escolaValidation = {
  create: [
    body('nome_escola')
      .isString()
      .notEmpty()
      .withMessage('Nome da escola é obrigatório')
      .trim()
      .isLength({ max: 255 })
  ],
  update: [
    param('id')
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('nome_escola')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 255 })
  ]
};

export const turmaValidation = {
  create: [
    body('nome_turma')
      .isString()
      .notEmpty()
      .withMessage('Nome da turma é obrigatório')
      .trim()
      .isLength({ max: 100 }),
    body('periodo')
      .isIn(['Matutino', 'Vespertino', 'Noturno'])
      .withMessage('Período inválido. Deve ser Matutino, Vespertino ou Noturno'),
    body('nivel_ensino')
      .isString()
      .notEmpty()
      .withMessage('Nível de ensino é obrigatório')
      .trim(),
    body('serie')
      .isString()
      .notEmpty()
      .withMessage('Série é obrigatória')
      .trim(),
    body('id_escola')
      .isUUID()
      .withMessage('ID da escola inválido')
  ],
  update: [
    param('id')
      .isUUID()
      .withMessage('ID da turma inválido'),
    body('nome_turma')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    body('periodo')
      .optional()
      .isIn(['Matutino', 'Vespertino', 'Noturno'])
      .withMessage('Período inválido. Deve ser Matutino, Vespertino ou Noturno'),
    body('nivel_ensino')
      .optional()
      .isString()
      .trim(),
    body('serie')
      .optional()
      .isString()
      .trim(),
    body('id_escola')
      .optional()
      .isUUID()
      .withMessage('ID da escola inválido')
  ]
};

export const alunoValidation = {
  create: [
    body('rm')
      .isString()
      .notEmpty()
      .withMessage('RM é obrigatório')
      .trim()
      .isLength({ max: 20 }),
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail()
      .trim(),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('nome_aluno')
      .isString()
      .notEmpty()
      .withMessage('Nome do aluno é obrigatório')
      .trim(),
    body('id_escola')
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('id_turma')
      .optional()
      .isUUID()
      .withMessage('ID da turma inválido')
  ],
  update: [
    param('id')
      .isInt()
      .withMessage('ID do aluno inválido')
      .toInt(),
    body('rm')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 20 }),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail()
      .trim(),
    body('nome_aluno')
      .optional()
      .isString()
      .trim(),
    body('id_escola')
      .optional()
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('id_turma')
      .optional()
      .isUUID()
      .withMessage('ID da turma inválido')
  ],
  updatePassword: [
    param('id')
      .isInt()
      .withMessage('ID do aluno inválido')
      .toInt(),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres')
  ]
};

export const salaValidation = {
  create: [
    body('nomeSala')
      .isString()
      .notEmpty()
      .withMessage('Nome da sala é obrigatório')
      .trim()
      .isLength({ max: 100 }),
    body('idEscola')
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('idTurma')
      .isUUID()
      .withMessage('ID da turma inválido'),
    body('idAluno')
      .optional({ nullable: true, checkFalsy: true })
      .isUUID()
      .withMessage('ID do aluno inválido'),
    body('idTabuada')
      .isUUID()
      .withMessage('ID da tabuada inválido'),
    body('dificuldade')
      .isIn(['Fácil', 'Médio', 'Difícil'])
      .withMessage('Dificuldade inválida. Deve ser Fácil, Médio ou Difícil'),
    body('modo')
      .isIn(['RANQUEADO', 'TREINAMENTO'])
      .withMessage('Modo inválido. Deve ser RANQUEADO ou TREINAMENTO'),
    body('dataHora')
      .isISO8601()
      .withMessage('Data e hora inválidas'),
  ],
  update: [
    param('id')
      .isUUID()
      .withMessage('ID da sala inválido'),
    body('nomeSala')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    body('idEscola')
      .optional()
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('idTurma')
      .optional()
      .isUUID()
      .withMessage('ID da turma inválido'),
    body('idAluno')
      .optional({ nullable: true, checkFalsy: true })
      .isUUID()
      .withMessage('ID do aluno inválido'),
    body('idTabuada')
      .optional()
      .isUUID()
      .withMessage('ID da tabuada inválido'),
    body('dificuldade')
      .optional()
      .isIn(['Fácil', 'Médio', 'Difícil'])
      .withMessage('Dificuldade inválida. Deve ser Fácil, Médio ou Difícil'),
    body('modo')
      .optional()
      .isIn(['RANQUEADO', 'TREINAMENTO'])
      .withMessage('Modo inválido. Deve ser RANQUEADO ou TREINAMENTO'),
    body('dataHora')
      .optional()
      .isISO8601()
      .withMessage('Data e hora inválidas'),
    body('status')
      .optional()
      .isIn(['AGENDADA', 'ABERTA', 'ENCERRADA', 'CANCELADA'])
      .withMessage('Status inválido. Deve ser AGENDADA, ABERTA, ENCERRADA ou CANCELADA'),
  ]
};

export const logValidation = {
  entrada: [
    body('sala_id')
      .isUUID()
      .withMessage('ID da sala inválido'),
    body('aluno_id')
      .isUUID()
      .withMessage('ID do aluno inválido')
  ],
  resultado: [
    body('sala_id')
      .isUUID()
      .withMessage('ID da sala inválido'),
    body('aluno_id')
      .isUUID()
      .withMessage('ID do aluno inválido'),
    body('acertos')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Acertos deve ser um número inteiro positivo'),
    body('erros')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Erros deve ser um número inteiro positivo'),
    body('tempo_segundos')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Tempo deve ser um número inteiro positivo'),
    body('nota')
      .optional()
      .isDecimal()
      .withMessage('Nota inválida')
  ]
};
