const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmetConfig = require('./middlewares/helmetMiddleware');
const { limiter, authLimiter } = require('./middlewares/rateLimitMiddleware');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/errorMiddleware');
const { getSupabase } = require('./config/supabase');
const routes = require('./routes');

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
        const supabase = getSupabase();
        const { error } = await supabase
            .from('Escolas')
            .select('id_escola')
            .limit(1);
        
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
        res.status(500).json({ 
            status: 'ERROR', 
            timestamp: Date.now(),
            database: 'disconnected',
            error: 'Database connection failed'
        });
    }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;