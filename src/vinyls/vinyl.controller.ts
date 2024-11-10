import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Review } from '../models/review.model';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vinyls')
@Controller('vinyls')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.vinylService.findAll(paginationDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.vinylService.findOne(id);
    }

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body() createVinylDto: CreateVinylDto) {
        return this.vinylService.create(createVinylDto);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(
        @Param('id') id: number,
        @Body() updateVinylDto: UpdateVinylDto
    ) {
        return this.vinylService.update(id, updateVinylDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: number) {
        return this.vinylService.delete(id);
    }

    @Post(':id/reviews')
    @UseGuards(AuthGuard)
    async createReview(
        @Param('id') vinylId: number,
        @Body() createReviewDto: CreateReviewDto,
        @Req() req: any
    ): Promise<Review> {
        const userId = req.user.userId;
        return await this.vinylService.addReview(vinylId, userId, {
            ...createReviewDto,
        });
    }

    @Get(':id/reviews')
    async getReviews(
        @Param('id') vinylId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<Review[]> {
        return await this.vinylService.getReviews(vinylId, page, limit);
    }
}
