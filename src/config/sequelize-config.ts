import { SequelizeOptions } from 'sequelize-typescript';
import { Vinyl } from '../models/vinyl.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { Purchase } from '../models/purchase.model';
import { Log } from '../models/log.model';

const config: SequelizeOptions = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'vinyl_store',
    models: [Vinyl, Review, User, Purchase, Log],
};

export default config;
