import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {}

    @Post('sendVinyl')
    @ApiOperation({ summary: 'Send a vinyl record to a Telegram chat' })
    @UseGuards(AdminGuard)
    async sendVinylRecord(@Body() record: any) {
        return this.telegramService.sendVinylRecord(record);
    }
}
