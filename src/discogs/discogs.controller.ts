import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { CreateVinylDto } from '../vinyls/dto/create-vinyl.dto';
import { Vinyl } from '../models/vinyl.model';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('discogs')
export class DiscogsController {
    constructor(private readonly discogsService: DiscogsService) {}

    @Get('vinyls')
    async getVinylRecords() {
        return this.discogsService.getVinylRecords();
    }

    @Get('vinyls/:id')
    async getVinylRecordById(@Param('id') id: number): Promise<CreateVinylDto> {
        return this.discogsService.getVinylRecordById(id);
    }

    @Get('vinyls/:id/scores')
    async getVinylRecordByIdWithScores(
        @Param('id') id: number
    ): Promise<CreateVinylDto> {
        return this.discogsService.getVinylRecordByIdWithScores(id);
    }

    @Post('vinyls/:id')
    @UseGuards(AdminGuard)
    async fetchAndSaveVinylRecord(@Param('id') id: number): Promise<Vinyl> {
        return this.discogsService.fetchAndSaveVinylRecord(id);
    }
}
