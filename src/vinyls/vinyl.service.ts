import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vinyl } from '../models/vinyl.model';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { Review } from '../models/review.model';
import { PaginationDto } from './dto/pagination.dto';
import { Op } from 'sequelize';
import { LogService } from '../logs/log.service';
import { ReviewService } from '../reviews/review.service';

@Injectable()
export class VinylService {
    constructor(
        @InjectModel(Vinyl)
        private vinylModel: typeof Vinyl,
        private logService: LogService,
        private reviewService: ReviewService
    ) {}

    async findAll(
        paginationDto: PaginationDto
    ): Promise<{ rows: Vinyl[]; count: number }> {
        let {
            limit = 10,
            offset = 0,
            sortBy = 'name',
            order = 'ASC',
            searchBy,
            searchTerm,
        } = paginationDto;
        limit = Number(limit);
        offset = Number(offset);
        const whereClause =
            searchBy && searchTerm
                ? { [searchBy]: { [Op.like]: `%${searchTerm}%` } }
                : {};
        return this.vinylModel.findAndCountAll({
            limit,
            offset,
            order: [[sortBy, order]],
            where: whereClause,
            include: [{ model: Review }],
        });
    }

    async findOne(id: number): Promise<Vinyl> {
        const vinyl = await this.vinylModel.findOne({
            where: { id },
            include: [{ model: Review }],
        });
        if (!vinyl) {
            throw new NotFoundException('Vinyl not found');
        }
        return vinyl;
    }

    async create(createVinylDto: CreateVinylDto): Promise<Vinyl> {
        const vinyl = await this.vinylModel.create({ ...createVinylDto });
        const vinylData = JSON.stringify(vinyl.dataValues);
        await this.logService.createLog(`Create vinyl: ${vinylData}`);
        return vinyl;
    }

    async update(id: number, updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
        const [numberOfAffectedRows] = await this.vinylModel.update(
            { ...updateVinylDto },
            {
                where: { id },
            }
        );

        const updatedVinyl = await this.vinylModel.findOne({
            where: { id },
        });

        if (!updatedVinyl) {
            throw new NotFoundException('Vinyl not found');
        }

        const vinylData = JSON.stringify(updatedVinyl.dataValues);
        await this.logService.createLog(`Update vinyl: ${vinylData}`);
        return updatedVinyl;
    }

    async delete(id: number): Promise<void> {
        const result = await this.vinylModel.destroy({
            where: { id },
        });
        if (result === 0) {
            throw new NotFoundException('Vinyl not found');
        }

        await this.logService.createLog(`Delete vinyl with id ${id}`);
    }

    async addReview(
        vinylId: number,
        userId: number,
        createReviewDto: any
    ): Promise<Review> {
        createReviewDto.vinylId = vinylId;
        createReviewDto.userId = userId;
        return await this.reviewService.createReview(createReviewDto);
    }
    async getReviews(
        vinylId: number,
        page: number,
        pageSize: number
    ): Promise<Review[]> {
        return await this.reviewService.findReviewsByVinylId(
            vinylId,
            page,
            pageSize
        );
    }
}
