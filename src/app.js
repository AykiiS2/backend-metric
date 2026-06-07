const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmetConfig = require('./middlewares/helmetMiddleware');
const { limiter, authLimiter } = require('./middlewares/rateLimitMiddleware');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/errorMiddleware');
const { getSupabase } = require('./config/supabase');
const routes = require('./routes');
const { iniciarJobLimpezaDistribuicao } = require('./jobs/limparDistribuicao');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.set('trust proxy', 1);

app.use(morgan('combined', {
    skip: (req) => req.path === '/health',
    stream: {
        write: (message) => {
            console.log(message.trim());
        }
    }
}));

app.use(helmetConfig);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/auth/login', authLimiter);
app.use('/api', limiter);

app.use('/api', routes);

app.get('/health', async (req, res) => {
    try {
        console.log('=== HEALTH CHECK DEBUG ===');
        console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
        console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'SET' : 'MISSING');
        
        const supabase = getSupabase();
        console.log('Supabase client created');
        
        const { data, error } = await supabase
            .from('escolas')
            .select('id_escola')
            .limit(1);
        
        console.log('Query result - error:', error);
        console.log('Query result - data:', data);
        
        if (error) {
            throw error;
        }
        
        res.status(200).json({ 
            status: 'OK', 
            timestamp: Date.now(),
            uptime: process.uptime(),
            database: 'connected'
        });
    } catch (error) {
        console.error('Health check error:', error);
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        
        res.status(500).json({ 
            status: 'ERROR', 
            timestamp: Date.now(),
            database: 'disconnected',
            error: error.message,
            details: error.details || 'No details'
        });
    }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;

iniciarJobLimpezaDistribuicao();
