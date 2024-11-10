import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '../models/review.model';
import { NotFoundException } from '@nestjs/common';
import { LogService } from '../logs/log.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review)
        private reviewModel: typeof Review,
        private logService: LogService
    ) {}

    async createReview(createReviewDto: any): Promise<Review> {
        const review = await this.reviewModel.create(createReviewDto);

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
        const offset = (page - 1) * pageSize;
        return await this.reviewModel.findAll({
            where: { vinylId },
            limit: pageSize,
            offset,
        });
    }
}
