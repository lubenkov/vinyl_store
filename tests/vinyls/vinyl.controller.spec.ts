import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateVinylDto } from '../../src/vinyls/dto/create-vinyl.dto';
import { UpdateVinylDto } from '../../src/vinyls/dto/update-vinyl.dto';
import { CreateReviewDto } from '../../src/reviews/dto/create-review.dto';
import { JwtService } from '@nestjs/jwt';
import { VinylService } from '../../src/vinyls/vinyl.service';

describe('VinylController (integration)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let adminToken: string;
    let userToken: string;
    let vinylService: VinylService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(VinylService)
            .useValue({
                findAll: jest.fn().mockResolvedValue({
                    rows: [{ id: 1, name: 'Test Vinyl' }],
                    count: 1,
                }),
                findOne: jest.fn().mockResolvedValue({
                    id: 1,
                    name: 'Test Vinyl',
                }),
                create: jest.fn().mockResolvedValue({
                    name: 'Test Vinyl',
                    author: 'Test Artist',
                    description: 'Test Description',
                    price: 20,
                    image: 'test-image-url',
                }),
                update: jest.fn().mockResolvedValue({
                    name: 'Updated Vinyl',
                    author: 'Updated Artist',
                    description: 'Updated Description',
                    price: 25,
                    image: 'updated-image-url',
                }),
                delete: jest.fn().mockResolvedValue(undefined),
                addReview: jest.fn().mockResolvedValue({
                    id: 1,
                    content: 'Great vinyl',
                    score: 5,
                }),
                getReviews: jest
                    .fn()
                    .mockResolvedValue([
                        { id: 1, content: 'Great vinyl', score: 5 },
                    ]),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = moduleFixture.get<JwtService>(JwtService);
        adminToken = jwtService.sign({ userId: 1 });
        userToken = jwtService.sign({ userId: 2 });
        vinylService = moduleFixture.get<VinylService>(VinylService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /vinyls - should return all vinyls', async () => {
        const response = await request(app.getHttpServer())
            .get('/vinyls')
            .expect(200);

        expect(response.body).toHaveProperty('rows');
        expect(response.body).toHaveProperty('count');
        expect(response.body.rows).toEqual([{ id: 1, name: 'Test Vinyl' }]);
    });

    it('GET /vinyls/:id - should return a vinyl by id', async () => {
        const response = await request(app.getHttpServer())
            .get('/vinyls/1')
            .expect(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body.name).toBe('Test Vinyl');
    });

    it('POST /vinyls - should create a vinyl', async () => {
        const createVinylDto: CreateVinylDto = {
            name: 'Test Vinyl',
            author: 'Test Artist',
            description: 'Test Description',
            price: 20,
            image: 'test-image-url',
        };
        const response = await request(app.getHttpServer())
            .post('/vinyls')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(createVinylDto)
            .expect(201);

        expect(response.body).toMatchObject(createVinylDto);
    });

    it('PUT /vinyls/:id - should update a vinyl', async () => {
        const updateVinylDto: UpdateVinylDto = {
            name: 'Updated Vinyl',
            author: 'Updated Artist',
            description: 'Updated Description',
            price: 25,
            image: 'updated-image-url',
        };
        const response = await request(app.getHttpServer())
            .put('/vinyls/1')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updateVinylDto)
            .expect(200);

        expect(response.body).toMatchObject(updateVinylDto);
    });

    it('DELETE /vinyls/:id - should delete a vinyl', async () => {
        await request(app.getHttpServer())
            .delete('/vinyls/1')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
    });

    it('POST /vinyls/:id/reviews - should add a review to a vinyl', async () => {
        const createReviewDto: CreateReviewDto = {
            content: 'Great vinyl',
            score: 5,
            userId: 2,
            vinylId: 1,
        };
        const response = await request(app.getHttpServer())
            .post('/vinyls/1/reviews')
            .set('Authorization', `Bearer ${userToken}`)
            .send(createReviewDto)
            .expect(201);

        expect(response.body).toHaveProperty('content', 'Great vinyl');
        expect(response.body).toHaveProperty('score', 5);
    });

    it('GET /vinyls/:id/reviews - should get reviews for a vinyl', async () => {
        const response = await request(app.getHttpServer())
            .get('/vinyls/1/reviews')
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toEqual([
            { id: 1, content: 'Great vinyl', score: 5 },
        ]);
    });
});
