import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DiscogsService } from './discogs.service';
import { CreateVinylDto } from '../vinyls/dto/create-vinyl.dto';
import { Vinyl } from '../models/vinyl.model';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('discogs')
@Controller('discogs')
export class DiscogsController {
    constructor(private readonly discogsService: DiscogsService) {}

    @Get('vinyls')
    @ApiOperation({ summary: 'Retrieve a list of vinyl records from Discogs' })
    async getVinylRecords() {
        return this.discogsService.getVinylRecords();
    }

    @Get('vinyls/:id')
    @ApiOperation({
        summary: 'Retrieve a vinyl record by its ID from Discogs',
    })
    async getVinylRecordById(@Param('id') id: number): Promise<CreateVinylDto> {
        return this.discogsService.getVinylRecordById(id);
    }

    @Get('vinyls/:id/scores')
    @ApiOperation({
        summary: 'Retrieve a vinyl record and its score by its ID from Discogs',
    })
    async getVinylRecordByIdWithScores(
        @Param('id') id: number
    ): Promise<CreateVinylDto> {
        return this.discogsService.getVinylRecordByIdWithScores(id);
    }

    @Post('vinyls/:id')
    @ApiOperation({
        summary:
            'Fetch a vinyl record by its ID from Discogs and save it to the database',
    })
    @UseGuards(AdminGuard)
    async fetchAndSaveVinylRecord(@Param('id') id: number): Promise<Vinyl> {
        return this.discogsService.fetchAndSaveVinylRecord(id);
    }
}
