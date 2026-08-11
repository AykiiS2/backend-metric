export const sanitize = (data) => {
  if (!data) return data;
  
  if (typeof data === 'string') {
    return data
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s@.-]/g, '')
      .trim();
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitize(item));
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (['senha', 'password', 'token', 'refreshToken'].includes(key)) {
        sanitized[key] = value;
        continue;
      }
      sanitized[key] = sanitize(value);
    }
    return sanitized;
  }

  return data;
};

export const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};
