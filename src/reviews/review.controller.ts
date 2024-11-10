import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: number): Promise<void> {
        return await this.reviewService.deleteReview(id);
    }
}
