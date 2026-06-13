function validateEnvironment() {
    const requiredEnvVars = [
        'JWT_SECRET',
        'SUPABASE_URL',
        'SUPABASE_KEY',
        'ALLOWED_ORIGINS'
    ];
    
    const missing = [];
    
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '));
        console.error('Please check your .env file');
        process.exit(1);
    }
    
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 64) {
        console.error('JWT_SECRET must be at least 64 characters long');
        process.exit(1);
    }
    
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.startsWith('https://')) {
        console.error('SUPABASE_URL must start with https://');
        process.exit(1);
    }
    
    const origins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    for (const origin of origins) {
        if (origin === '*') {
            console.error('Wildcard origins not allowed');
            process.exit(1);
        }
    }
}

module.exports = { validateEnvironment };