const { getSupabase } = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(email, senha) {
        const supabase = getSupabase();
        const JWT_SECRET = process.env.JWT_SECRET;
        
        if (!JWT_SECRET) {
            throw new Error('JWT configuration missing');
        }
        
        const { data: usuario, error } = await supabase
            .from('autenticacao')
            .select('id_autenticacao, email, senha_hash')
            .eq('email', email)
            .single();
        
        if (error || !usuario) {
            throw new Error('Invalid credentials');
        }
        
        const isValidPassword = await bcrypt.compare(senha, usuario.senha_hash);
        
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        
        const token = jwt.sign(
            { 
                id: usuario.id_autenticacao, 
                email: usuario.email
            },
            JWT_SECRET,
            { 
                expiresIn: '24h', 
                algorithm: 'HS256',
                issuer: 'metric-backend',
                audience: 'metric-app'
            }
        );
        
        await supabase
            .from('autenticacao')
            .update({ ultimo_login: new Date().toISOString() })
            .eq('id_autenticacao', usuario.id_autenticacao);
        
        return {
            token: token,
            expiresIn: 86400,
            usuario: {
                id: usuario.id_autenticacao,
                email: usuario.email
            }
        };
    }
}

module.exports = new AuthService();