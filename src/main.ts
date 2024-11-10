import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/utils/logger.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000, () => {
        logger.info(`Server listening at http://localhost:3000`);
    });
}
bootstrap();
