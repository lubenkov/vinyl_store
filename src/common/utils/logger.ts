import winston from 'winston';

const transports: winston.transport[] = [new winston.transports.Console()];

// Serverless filesystems are read-only; keep file logs for local development.
if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports,
});
