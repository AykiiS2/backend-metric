require('dotenv').config();
const app = require('./src/app');
const { validateEnvironment } = require('./src/utils/envValidator');

const PORT = process.env.PORT || 3001;

validateEnvironment();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
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