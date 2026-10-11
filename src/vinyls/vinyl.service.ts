import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Vinyl } from '../models/vinyl.model';
import { Review } from '../models/review.model';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { LogService } from '../logs/log.service';
import { ReviewService } from '../reviews/review.service';

const SORTABLE_COLUMNS = ['id', 'name', 'author', 'price'];
const SEARCHABLE_COLUMNS = ['name', 'author'];

const escapeLikeTerm = (term: string): string =>
    term.replace(/[\\%_]/g, '\\$&');

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
        const { limit = 10, offset = 0, searchBy, searchTerm } = paginationDto;

        const requestedSortBy = paginationDto.sortBy ?? '';
        const sortBy = SORTABLE_COLUMNS.includes(requestedSortBy)
            ? requestedSortBy
            : 'name';
        const order = paginationDto.order === 'DESC' ? 'DESC' : 'ASC';

        const whereClause = (
            searchBy && searchTerm && SEARCHABLE_COLUMNS.includes(searchBy)
                ? {
                      [searchBy]: {
                          [Op.like]: `%${escapeLikeTerm(searchTerm)}%`,
                      },
                  }
                : {}
        ) as WhereOptions;

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
        await this.vinylModel.update(
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
        createReviewDto: CreateReviewDto
    ): Promise<Review> {
        return await this.reviewService.createReview({
            ...createReviewDto,
            userId,
            vinylId,
        });
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
