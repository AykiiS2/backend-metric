const authService = require('../services/authService');

class AuthController {
    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email and password required' });
            }
            
            const emailSanitized = email.toLowerCase().trim();
            
            if (!this.isValidEmail(emailSanitized)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            
            const result = await authService.login(emailSanitized, senha);
            
            res.status(200).json(result);
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                res.status(401).json({ error: 'Invalid credentials' });
            } else {
                next(error);
            }
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = new AuthController();