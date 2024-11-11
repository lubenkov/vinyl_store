import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from '../../src/common/guards/admin.guard';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { PurchaseService } from '../../src/purchases/purchase.service';
import { CreatePurchaseDto } from '../../src/purchases/dto/create-purchase.dto';

describe('PurchaseController (integration)', () => {
    let app: INestApplication;
    let purchaseService: PurchaseService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PurchaseService)
            .useValue({
                createPurchase: jest.fn().mockResolvedValue({
                    vinylId: 1,
                    userId: 1,
                    amount: 50,
                    status: 'test',
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

        purchaseService = moduleFixture.get<PurchaseService>(PurchaseService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /purchases - should create a purchase', async () => {
        const createPurchaseDto: CreatePurchaseDto = {
            vinylId: 2,
            amount: 50,
            currency: 'usd',
        };
        const response = await request(app.getHttpServer())
            .post('/purchases')
            .send(createPurchaseDto)
            .expect(201);

        expect(response.body).toMatchObject({
            vinylId: 1,
            userId: 1,
            amount: 50,
            status: 'test',
        });
    });
});
