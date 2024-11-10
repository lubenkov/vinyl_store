import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { Log } from '../models/log.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogController {
    constructor(private logService: LogService) {}

    @UseGuards(AdminGuard)
    @Get()
    async getLogs(): Promise<Log[]> {
        return await this.logService.getLogs();
    }
}
