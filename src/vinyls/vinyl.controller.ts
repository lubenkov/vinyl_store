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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('vinyls')
@Controller('vinyls')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Get()
    @ApiOperation({
        summary: 'Retrieve a list of all vinyl records with pagination',
    })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.vinylService.findAll(paginationDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific vinyl record by its ID' })
    async findOne(@Param('id') id: number) {
        return this.vinylService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new vinyl record' })
    @UseGuards(AdminGuard)
    async create(@Body() createVinylDto: CreateVinylDto) {
        return this.vinylService.create(createVinylDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing vinyl record by its ID' })
    @UseGuards(AdminGuard)
    async update(
        @Param('id') id: number,
        @Body() updateVinylDto: UpdateVinylDto
    ) {
        return this.vinylService.update(id, updateVinylDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a specific vinyl record by its ID' })
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: number) {
        return this.vinylService.delete(id);
    }

    @Post(':id/reviews')
    @ApiOperation({ summary: 'Create a review for a specific vinyl record' })
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
    @ApiOperation({
        summary: 'Retrieve all reviews for a specific vinyl record',
    })
    async getReviews(
        @Param('id') vinylId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<Review[]> {
        return await this.vinylService.getReviews(vinylId, page, limit);
    }
}
