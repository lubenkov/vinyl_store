import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('HealthController (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/health (GET)', async () => {
        const packageJson = {
            name: 'final_project',
            version: '1.0.0',
        };

        const response = await request(app.getHttpServer())
            .get('/health')
            .expect(200);

        expect(response.body).toEqual({
            name: packageJson.name,
            version: packageJson.version,
        });

        expect(response.headers['content-type']).toBe('application/json');
        expect(response.headers['x-powered-by']).toBe('Node.js');
        expect(response.headers['cache-control']).toBe(
            'no-cache, no-store, must-revalidate'
        );
        expect(response.headers['connection']).toBe('keep-alive');
    });
});
