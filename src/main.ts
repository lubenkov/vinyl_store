import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/utils/logger';
import { configureApp } from './setup-app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    configureApp(app, 'api/docs');

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}/api`);
    });
}

bootstrap().catch((error) => {
    logger.error(error);
    process.exit(1);
});
