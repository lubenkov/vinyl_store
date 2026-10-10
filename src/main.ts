import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/utils/logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true })
    );

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Vinyl Store API')
        .setDescription('Backend API for a vinyl records store')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = Number(process.env.PORT) || 3000;
    await app.listen(port, () => {
        logger.info(`Server listening at http://localhost:${port}`);
    });
}
bootstrap();
