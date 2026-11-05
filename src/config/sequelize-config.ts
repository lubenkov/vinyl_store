// Sequelize loads the MySQL driver with a dynamic `require('mysql2')`, which
// file tracers cannot see. Without this static import the driver is dropped
// from the serverless bundle and the app dies with "Please install mysql2
// package manually".
import 'mysql2';
import { SequelizeOptions } from 'sequelize-typescript';
import { ConfigServiceImpl } from './config.service';
import { Vinyl } from '../models/vinyl.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { Purchase } from '../models/purchase.model';
import { Log } from '../models/log.model';

export const createSequelizeOptions = (
    config: ConfigServiceImpl
): SequelizeOptions => ({
    dialect: 'mysql',
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseName,
    dialectOptions: config.databaseSsl
        ? { ssl: { rejectUnauthorized: true } }
        : undefined,
    pool: {
        max: config.databasePoolMax,
        min: 0,
        idle: 10_000,
        acquire: 30_000,
    },
    models: [Vinyl, Review, User, Purchase, Log],
    logging: false,
});
