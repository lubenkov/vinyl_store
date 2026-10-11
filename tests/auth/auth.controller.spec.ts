import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { AdminGuard } from '../../src/common/guards/admin.guard';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('AuthController (integration)', () => {
    let app: INestApplication;
    let authService: any;

    beforeAll(async () => {
        authService = {
            register: jest.fn().mockResolvedValue({
                accessToken: 'test-jwt-token',
            }),
            login: jest.fn().mockResolvedValue({
                accessToken: 'test-jwt-token',
            }),
            generateJwt: jest.fn().mockReturnValue('test-jwt-token'),
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue(authService)
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
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /auth/register - should register a user and return an access token', async () => {
        const registerDto: RegisterDto = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@gmail.com',
            password: 'password123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(registerDto)
            .expect(201);

        expect(authService.register).toHaveBeenCalledWith(registerDto);
        expect(response.body).toEqual({ accessToken: 'test-jwt-token' });
    });

    it('POST /auth/login - should log a user in and return an access token', async () => {
        const loginDto: LoginDto = {
            email: 'test@gmail.com',
            password: 'password123',
        };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto)
            .expect(201);

        expect(authService.login).toHaveBeenCalledWith(loginDto);
        expect(response.body).toEqual({ accessToken: 'test-jwt-token' });
    });

    it('GET /auth/google - should initiate Google OAuth flow', async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/google')
            .expect(302);
        expect(response.headers['location']).toContain('google');
    });

    it('GET /auth/google/callback - should handle Google OAuth callback and redirect', async () => {
        await request(app.getHttpServer())
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
