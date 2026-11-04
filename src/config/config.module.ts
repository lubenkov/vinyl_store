import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigServiceImpl } from './config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_HOST: Joi.string().required(),
                // MySQL default port (the old value 5432 is PostgreSQL's).
                DATABASE_PORT: Joi.number().default(3306),
                DATABASE_USER: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                DATABASE_SSL: Joi.boolean().default(false),
                DATABASE_POOL_MAX: Joi.number()
                    .integer()
                    .min(1)
                    .max(20)
                    .default(5),
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test')
                    .default('development'),
                JWT_SECRET: Joi.string().min(32).required(),
                STRIPE_SECRET_KEY: Joi.string().required(),
                EMAIL_SERVICE: Joi.string().required(),
                EMAIL_USER: Joi.string().required(),
                EMAIL_PASS: Joi.string().required(),
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),
                GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
                FRONTEND_URL: Joi.string()
                    .uri()
                    .default('http://localhost:5173'),
                CORS_ORIGINS: Joi.string().allow('').optional(),
                SWAGGER_ENABLED: Joi.boolean().default(false),
                TELEGRAM_BOT_TOKEN: Joi.string().required(),
                TELEGRAM_CHAT_ID: Joi.string().required(),
                DISCOGS_KEY: Joi.string().required(),
                DISCOGS_SECRET: Joi.string().required(),
            }),
        }),
    ],
    providers: [ConfigServiceImpl],
    exports: [ConfigServiceImpl],
})
export class AppConfigModule {}
