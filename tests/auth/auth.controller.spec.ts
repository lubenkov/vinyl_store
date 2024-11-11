import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { AdminGuard } from '../../src/common/guards/admin.guard';

describe('AuthController (integration)', () => {
    let app: INestApplication;
    let authService: AuthService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue({
                generateJwt: jest.fn().mockReturnValue('test-jwt-token'),
            })
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: jest.fn((context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { userId: 1 };
                    return true;
                }),
            })
            .overrideGuard(AdminGuard)
            .useValue({
                canActivate: jest.fn((context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { userId: 1 };
                    return true;
                }),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        authService = moduleFixture.get<AuthService>(AuthService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /auth/google - should initiate Google OAuth flow', async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/google')
            .expect(302);
        expect(response.headers['location']).toContain('google');
    });
    it('GET /auth/google/callback - should handle Google OAuth callback and redirect', async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/google/callback')
            .expect(302);
    });
    it('GET /auth/logout - should clear jwt cookie and redirect', async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/logout')
            .expect(302);
        expect(response.headers['location']).toBe('/');
    });
});
