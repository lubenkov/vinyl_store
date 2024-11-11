import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from '../../src/reviews/review.service';
import { getModelToken } from '@nestjs/sequelize';
import { Review } from '../../src/models/review.model';
import { LogService } from '../../src/logs/log.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewService', () => {
    let service: ReviewService;
    let reviewModel: any;
    let logService: any;

    beforeEach(async () => {
        reviewModel = {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn(),
        };

        logService = {
            createLog: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                {
                    provide: getModelToken(Review),
                    useValue: reviewModel,
                },
                {
                    provide: LogService,
                    useValue: logService,
                },
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createReview', () => {
        it('should create a review', async () => {
            const createReviewDto = {
                content: 'Great review',
                score: 5,
                vinylId: 1,
                userId: 1,
            };
            const createdReview = {
                ...createReviewDto,
                id: 1,
                dataValues: { ...createReviewDto, id: 1 },
            };

            reviewModel.create.mockResolvedValue(createdReview);

            const result = await service.createReview(createReviewDto);

            expect(result).toEqual(createdReview);
            expect(reviewModel.create).toHaveBeenCalledWith(createReviewDto);
            expect(logService.createLog).toHaveBeenCalledWith(
                `Create review: ${JSON.stringify(createdReview.dataValues)}`
            );
        });
    });

    describe('findAll', () => {
        it('should return all reviews', async () => {
            const reviews = [{ id: 1, content: 'Great review', score: 5 }];
            reviewModel.findAll.mockResolvedValue(reviews);

            const result = await service.findAll();

            expect(result).toEqual(reviews);
            expect(reviewModel.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should find one review by id', async () => {
            const review = { id: 1, content: 'Great review', score: 5 };
            reviewModel.findByPk.mockResolvedValue(review);

            const result = await service.findById(1);

            expect(result).toEqual(review);
            expect(reviewModel.findByPk).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if review not found', async () => {
            reviewModel.findByPk.mockResolvedValue(null);

            await expect(service.findById(1)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('deleteReview', () => {
        it('should delete a review and create log', async () => {
            reviewModel.destroy.mockResolvedValue(1);

            await service.deleteReview(1);

            expect(reviewModel.destroy).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(logService.createLog).toHaveBeenCalledWith(
                'Delete review with id 1'
            );
        });

        it('should throw NotFoundException if review not found', async () => {
            reviewModel.destroy.mockResolvedValue(0);

            await expect(service.deleteReview(1)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('findReviewsByVinylId', () => {
        it('should return reviews for a vinyl by vinylId with pagination', async () => {
            const reviews = [
                {
                    id: 1,
                    content: 'Great review',
                    score: 5,
                    vinylId: 1,
                    userId: 1,
                },
            ];
            const vinylId = 1;
            const page = 1;
            const pageSize = 10;

            reviewModel.findAll.mockResolvedValue(reviews);

            const result = await service.findReviewsByVinylId(
                vinylId,
                page,
                pageSize
            );

            expect(result).toEqual(reviews);
            expect(reviewModel.findAll).toHaveBeenCalledWith({
                where: { vinylId },
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });
        });
    });
});
