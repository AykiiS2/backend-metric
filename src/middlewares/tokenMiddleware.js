const jwt = require('jsonwebtoken');

async function tokenMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const JWT_SECRET = process.env.JWT_SECRET;
        
        if (!JWT_SECRET) {
            throw new Error('JWT configuration missing');
        }
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token || token.split('.').length !== 3) {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET, { 
            algorithms: ['HS256'],
            issuer: 'metric-backend',
            audience: 'metric-app'
        });
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(500).json({ error: 'Authentication error' });
    }
}

module.exports = { tokenMiddleware };