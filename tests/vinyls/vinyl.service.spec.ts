import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from '../../src/vinyls/vinyl.service';
import { getModelToken } from '@nestjs/sequelize';
import { Vinyl } from '../../src/models/vinyl.model';
import { LogService } from '../../src/logs/log.service';
import { ReviewService } from '../../src/reviews/review.service';
import { NotFoundException } from '@nestjs/common';
import { CreateVinylDto } from '../../src/vinyls/dto/create-vinyl.dto';
import { UpdateVinylDto } from '../../src/vinyls/dto/update-vinyl.dto';
import { PaginationDto } from '../../src/vinyls/dto/pagination.dto';
import { Review } from '../../src/models/review.model';

describe('VinylService', () => {
    let service: VinylService;
    let vinylModel: any;
    let logService: any;
    let reviewService: any;

    beforeEach(async () => {
        vinylModel = {
            findAndCountAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        };

        logService = {
            createLog: jest.fn(),
        };

        reviewService = {
            createReview: jest.fn(),
            findReviewsByVinylId: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VinylService,
                {
                    provide: getModelToken(Vinyl),
                    useValue: vinylModel,
                },
                {
                    provide: LogService,
                    useValue: logService,
                },
                {
                    provide: ReviewService,
                    useValue: reviewService,
                },
            ],
        }).compile();

        service = module.get<VinylService>(VinylService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a vinyl', async () => {
            const createVinylDto: CreateVinylDto = {
                name: 'test',
                author: 'test',
                description: 'test',
                price: 20,
                image: 'test',
            };

            vinylModel.create.mockResolvedValue({
                ...createVinylDto,
                id: 1,
            });

            const result = await service.create(createVinylDto);

            expect(result).toEqual({
                ...createVinylDto,
                id: 1,
            });
            expect(vinylModel.create).toHaveBeenCalledWith({
                ...createVinylDto,
            });
        });
    });

    describe('findAll', () => {
        it('should return all vinyls with pagination', async () => {
            const paginationDto: PaginationDto = {
                limit: 10,
                offset: 0,
                sortBy: 'name',
                order: 'ASC',
            };
            vinylModel.findAndCountAll.mockResolvedValue({
                rows: [{ id: 1, name: 'Test Vinyl' }],
                count: 1,
            });

            const result = await service.findAll(paginationDto);

            expect(result.rows).toEqual([{ id: 1, name: 'Test Vinyl' }]);
            expect(result.count).toEqual(1);
            expect(vinylModel.findAndCountAll).toHaveBeenCalledWith({
                limit: 10,
                offset: 0,
                order: [['name', 'ASC']],
                where: {},
                include: [{ model: Review }],
            });
        });
    });

    describe('findOne', () => {
        it('should find one vinyl by id', async () => {
            const vinylData = { id: 1, name: 'Test Vinyl' };
            vinylModel.findOne.mockResolvedValue(vinylData);

            const result = await service.findOne(1);

            expect(result).toEqual(vinylData);
        });

        it('should throw NotFoundException if vinyl not found', async () => {
            vinylModel.findOne.mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a vinyl', async () => {
            const updateVinylDto: UpdateVinylDto = {
                name: 'Updated Vinyl',
                author: 'Updated Artist',
                description: 'Updated Description',
                price: 25,
                image: 'updated-image-url',
            };

            const vinylData = { id: 1, ...updateVinylDto };
            vinylModel.update.mockResolvedValue([1, [vinylData]]);
            vinylModel.findOne.mockResolvedValue(vinylData);

            const result = await service.update(1, updateVinylDto);

            expect(result).toEqual(vinylData);
            expect(vinylModel.update).toHaveBeenCalledWith(
                { ...updateVinylDto },
                { where: { id: 1 } }
            );
        });

        it('should throw NotFoundException if vinyl not found', async () => {
            vinylModel.update.mockResolvedValue([0, []]);

            await expect(
                service.update(1, {
                    name: 'Updated Vinyl',
                    author: 'Author',
                    description: 'Description',
                    price: 20,
                    image: 'Image',
                })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete a vinyl and log the deletion', async () => {
            vinylModel.destroy.mockResolvedValue(1);

            await service.delete(1);

            expect(vinylModel.destroy).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(logService.createLog).toHaveBeenCalledWith(
                'Delete vinyl with id 1'
            );
        });

        it('should throw NotFoundException if vinyl not found', async () => {
            vinylModel.destroy.mockResolvedValue(0);

            await expect(service.delete(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('addReview', () => {
        it('should add a review to a vinyl', async () => {
            const reviewData = {
                content: 'Great vinyl',
                score: 5,
                userId: 1,
                vinylId: 1,
            };
            reviewService.createReview.mockResolvedValue({
                id: 1,
                ...reviewData,
            });

            const result = await service.addReview(1, 1, reviewData);

            expect(result).toEqual({ id: 1, ...reviewData });
            expect(reviewService.createReview).toHaveBeenCalledWith(reviewData);
        });
    });

    describe('getReviews', () => {
        it('should get reviews for a vinyl', async () => {
            const reviews = [
                {
                    id: 1,
                    content: 'Great vinyl',
                    score: 5,
                    vinylId: 1,
                    userId: 1,
                },
            ];
            reviewService.findReviewsByVinylId.mockResolvedValue(reviews);

            const result = await service.getReviews(1, 1, 10);

            expect(result).toEqual(reviews);
            expect(reviewService.findReviewsByVinylId).toHaveBeenCalledWith(
                1,
                1,
                10
            );
        });
    });
});
