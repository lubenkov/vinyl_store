import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {}

    @Post('sendVinyl')
    @UseGuards(AdminGuard)
    async sendVinylRecord(@Body() record: any) {
        return this.telegramService.sendVinylRecord(record);
    }
}
