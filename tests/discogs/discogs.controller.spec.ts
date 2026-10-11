import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AdminGuard } from '../../src/common/guards/admin.guard';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { DiscogsService } from '../../src/discogs/discogs.service';

describe('DiscogsController (integration)', () => {
    let app: INestApplication;
    let discogsService: any;

    beforeAll(async () => {
        discogsService = {
            getVinylRecords: jest.fn().mockResolvedValue({
                name: 'test',
            }),
            getVinylRecordById: jest.fn().mockResolvedValue({
                name: 'test',
            }),
            getVinylRecordByIdWithScores: jest.fn().mockResolvedValue({
                name: 'test',
                score: 5,
            }),
            fetchAndSaveVinylRecord: jest.fn().mockResolvedValue({
                name: 'test',
            }),
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(DiscogsService)
            .useValue(discogsService)
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

    it('GET /discogs/vinyls - should return vinyls from Discogs', async () => {
        const response = await request(app.getHttpServer())
            .get('/discogs/vinyls')
            .expect(200);

        expect(response.body).toMatchObject({
            name: 'test',
        });
    });

    it('GET /discogs/vinyls/1 - should return a vinyl by id from Discogs', async () => {
        const response = await request(app.getHttpServer())
            .get('/discogs/vinyls/1')
            .expect(200);

        expect(discogsService.getVinylRecordById).toHaveBeenCalledWith(1);
        expect(response.body).toMatchObject({
            name: 'test',
        });
    });

    it('GET /discogs/vinyls/1/scores - should return a vinyl by id with score from Discogs', async () => {
        const response = await request(app.getHttpServer())
            .get('/discogs/vinyls/1/scores')
            .expect(200);

        expect(response.body).toMatchObject({
            name: 'test',
            score: 5,
        });
    });

    it('POST /discogs/vinyls/1 - should fetch a vinyl record from Discogs by id and save it to the database', async () => {
        const response = await request(app.getHttpServer())
            .post('/discogs/vinyls/1')
            .expect(201);

        expect(discogsService.fetchAndSaveVinylRecord).toHaveBeenCalledWith(1);
        expect(response.body).toMatchObject({
            name: 'test',
        });
    });
});
