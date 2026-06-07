function errorMiddleware(err, req, res, next) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    console.error({
        message: err.message,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method
    });
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error' });
    }
    
    if (err.code === 'PGRST116') {
        return res.status(404).json({ error: 'Resource not found' });
    }
    
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    
    res.status(500).json({ 
        error: isProduction ? 'Internal server error' : err.message
    });
}

function notFoundMiddleware(req, res) {
    res.status(404).json({ error: 'Route not found' });
}

module.exports = { errorMiddleware, notFoundMiddleware };