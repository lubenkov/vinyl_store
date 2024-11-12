import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AdminGuard } from '../../src/common/guards/admin.guard';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { TelegramService } from '../../src/telegram/telegram.service';

describe('TelegramController (integration)', () => {
    let app: INestApplication;
    let telegramService: TelegramService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(TelegramService)
            .useValue({
                sendVinylRecord: jest.fn().mockResolvedValue({
                    ok: true,
                }),
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

        telegramService = moduleFixture.get<TelegramService>(TelegramService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /telegram/sendVinyl - should send a vinyl to Telegram channel', async () => {
        const vinyl = {
            name: 'test',
            link: 'test',
            price: 10,
        };
        const response = await request(app.getHttpServer())
            .post('/telegram/sendVinyl')
            .send(vinyl)
            .expect(201);

        expect(response.body).toMatchObject({
            ok: true,
        });
    });
});
