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
        if (email.length > 254) return false;
        
        const atIndex = email.indexOf('@');
        if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) return false;
        
        const localPart = email.substring(0, atIndex);
        const domain = email.substring(atIndex + 1);
        
        if (localPart.length === 0 || localPart.length > 64) return false;
        if (domain.length === 0 || domain.length > 253) return false;
        
        if (!this.isValidLocalPart(localPart)) return false;
        if (!this.isValidDomain(domain)) return false;
        
        return true;
    }
    
    isValidLocalPart(localPart) {
        const allowedChars = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
        if (!allowedChars.test(localPart)) return false;
        
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false;
        
        return true;
    }
    
    isValidDomain(domain) {
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return domainRegex.test(domain);
    }
}

module.exports = new AuthController();
