import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from './app.module';
import { logger } from './common/utils/logger';
import { configureApp } from './setup-app';

async function createApp(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    configureApp(app, 'api/docs');

    await app.init();
    return app;
}

let appPromise: Promise<INestApplication> | null = null;

function getApp(): Promise<INestApplication> {
    if (!appPromise) {
        appPromise = createApp().catch((error) => {
            // Do not cache a failed start: the next request should retry.
            appPromise = null;
            throw error;
        });
    }
    return appPromise;
}

/**
 * Serverless entrypoint (Vercel, AWS Lambda, ...).
 *
 * The runtime calls this handler for every request, so the Nest application
 * is created lazily on the first request and reused afterwards. Creating it
 * lazily also means a slow database cannot make the runtime give up on
 * detecting a request handler.
 */
export default async function handler(
    req: IncomingMessage,
    res: ServerResponse
): Promise<void> {
    const app = await getApp();
    const server = app.getHttpAdapter().getInstance() as (
        req: IncomingMessage,
        res: ServerResponse
    ) => void;
    return server(req, res);
}

/**
 * Local development and `npm run start:prod`: run a regular HTTP server.
 */
if (typeof require !== 'undefined' && require.main === module) {
    createApp()
        .then(async (app) => {
            const port = Number(process.env.PORT) || 3000;
            await app.listen(port);
            logger.info(`Server listening at http://localhost:${port}/api`);
        })
        .catch((error) => {
            logger.error(error);
            process.exit(1);
        });
}
