import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { Log } from '../models/log.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogController {
    constructor(private logService: LogService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all log records' })
    @UseGuards(AdminGuard)
    async getLogs(): Promise<Log[]> {
        return await this.logService.getLogs();
    }
}
