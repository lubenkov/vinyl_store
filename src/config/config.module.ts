import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigServiceImpl } from './config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().default(5432),
                DATABASE_USER: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                STRIPE_SECRET_KEY: Joi.string().required(),
                STRIPE_VERSION: Joi.string().required(),
                EMAIL_SERVICE: Joi.string().required(),
                EMAIL_USER: Joi.string().required(),
                EMAIL_PASS: Joi.string().required(),
                GOOGLE_CLIENT_ID: Joi.string().required(),
                GOOGLE_CLIENT_SECRET: Joi.string().required(),
                GOOGLE_CALLBACK_URL: Joi.string().required(),
            }),
        }),
    ],
    providers: [ConfigServiceImpl],
    exports: [ConfigServiceImpl],
})
export class AppConfigModule {}
