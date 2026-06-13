require('dotenv').config();
const app = require('./src/app');
const { validateEnvironment } = require('./src/utils/envValidator');

const PORT = process.env.PORT || 3001;

validateEnvironment();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS configurado para ambiente: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM recebido - fechando servidor');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recebido - fechando servidor');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    server.close(() => {
        process.exit(1);
    });
});