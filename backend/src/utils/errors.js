export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if (err.code) {
    return res.status(400).json({
      error: `Erro no banco de dados: ${err.message}`
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
};
