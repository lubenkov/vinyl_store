require('dotenv').config();

const useSsl = process.env.DATABASE_SSL === 'true';
const dialectOptions = useSsl
    ? { ssl: { rejectUnauthorized: true } }
    : undefined;
const pool = {
    max: Number(process.env.DATABASE_POOL_MAX) || 5,
    min: 0,
    idle: 10000,
    acquire: 30000,
};

const database = {
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'vinyl_store',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT) || 3306,
    dialect: 'mysql',
    dialectOptions,
    pool,
};

module.exports = {
    development: database,
    test: {
        ...database,
        database: process.env.DATABASE_NAME || 'vinyl_store_test',
    },
    production: database,
};
