import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { LogService } from '../logs/log.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review)
        private reviewModel: typeof Review,
        private logService: LogService
    ) {}

    async createReview(
        createReviewDto: CreateReviewDto & { userId: number; vinylId: number }
    ): Promise<Review> {
        const review = await this.reviewModel.create({ ...createReviewDto });

        const reviewData = JSON.stringify(review.dataValues);
        await this.logService.createLog(`Create review: ${reviewData}`);

        return review;
    }

    async findAll(): Promise<Review[]> {
        return await this.reviewModel.findAll();
    }

    async findById(id: number): Promise<Review> {
        const review = await this.reviewModel.findByPk(id);

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async deleteReview(id: number): Promise<void> {
        const result = await this.reviewModel.destroy({
            where: { id },
        });
        if (result === 0) {
            throw new NotFoundException('Review not found');
        }

        await this.logService.createLog(`Delete review with id ${id}`);
    }

    async findReviewsByVinylId(
        vinylId: number,
        page: number,
        pageSize: number
    ): Promise<Review[]> {
        const safePage = Math.min(
            Math.max(Number.isFinite(page) ? Math.trunc(page) : 1, 1),
            10_000
        );
        const safePageSize = Math.min(
            Math.max(Number.isFinite(pageSize) ? Math.trunc(pageSize) : 10, 1),
            50
        );
        const offset = (safePage - 1) * safePageSize;
        return await this.reviewModel.findAll({
            where: { vinylId },
            limit: safePageSize,
            offset,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'avatar'],
                },
            ],
        });
    }
}
