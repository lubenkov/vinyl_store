import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/setup-app';

describe('HealthController (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        configureApp(app, 'api/docs');
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/api/health (GET)', async () => {
        const packageJson = {
            name: 'vinyl-store',
            version: '1.0.0',
        };

        const response = await request(app.getHttpServer())
            .get('/api/health')
            .expect(200);

        expect(response.body).toEqual({
            name: packageJson.name,
            version: packageJson.version,
        });

        expect(response.headers['content-type']).toContain('application/json');
        expect(response.headers['x-powered-by']).toBeUndefined();
        expect(response.headers['cache-control']).toBe(
            'no-cache, no-store, must-revalidate'
        );

        await request(app.getHttpServer()).get('/health').expect(404);
        await request(app.getHttpServer()).get('/api/docs').expect(200);
    });
});
