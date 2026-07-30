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
      .isIn(['manhã', 'tarde', 'noite', 'integral'])
      .withMessage('Período inválido'),
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
      .isIn(['manhã', 'tarde', 'noite', 'integral'])
      .withMessage('Período inválido'),
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
      .isUUID()
      .withMessage('ID do aluno inválido'),
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
  ]
};

export const salaValidation = {
  create: [
    body('nome_sala')
      .isString()
      .notEmpty()
      .withMessage('Nome da sala é obrigatório')
      .trim()
      .isLength({ max: 100 }),
    body('id_escola')
      .isUUID()
      .withMessage('ID da escola inválido'),
    body('id_turma')
      .optional()
      .isUUID()
      .withMessage('ID da turma inválido')
  ]
};

export const logValidation = {
  entrada: [
    body('id_sala')
      .isUUID()
      .withMessage('ID da sala inválido'),
    body('id_aluno')
      .isUUID()
      .withMessage('ID do aluno inválido')
  ],
  resultado: [
    body('id_sala')
      .isUUID()
      .withMessage('ID da sala inválido'),
    body('id_aluno')
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
    body('tempo_total')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Tempo total deve ser um número inteiro positivo'),
    body('pontuacao_obtida')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Pontuação obtida deve ser um número inteiro positivo')
  ]
};