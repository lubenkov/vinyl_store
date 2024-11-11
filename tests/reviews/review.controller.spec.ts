import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ReviewService } from '../../src/reviews/review.service';
import { AdminGuard } from '../../src/common/guards/admin.guard';
import { AuthGuard } from '../../src/common/guards/auth.guard';

describe('ReviewController (integration)', () => {
    let app: INestApplication;
    let reviewService: ReviewService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ReviewService)
            .useValue({
                deleteReview: jest.fn().mockResolvedValue(undefined),
            })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(AdminGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        reviewService = moduleFixture.get<ReviewService>(ReviewService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('DELETE /reviews/:id - should delete a review', async () => {
        await request(app.getHttpServer()).delete('/reviews/1').expect(200);
    });
});
