import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigServiceImpl } from '../config/config.service';

@Injectable()
export class TelegramService {
    private readonly BOT_TOKEN = this.configService.telegramBotToken;
    private readonly CHAT_ID = this.configService.telegramChatId;
    private readonly BASE_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}`;

    constructor(
        private httpService: HttpService,
        private configService: ConfigServiceImpl
    ) {}

    async sendVinylRecord(record: any): Promise<any> {
        const url = `${this.BASE_URL}/sendMessage`;
        const message = `Название: ${record.name}\nСсылка: ${record.link}\nЦена: ${record.price}`;
        const response = await firstValueFrom(
            this.httpService.post(url, {
                chat_id: this.CHAT_ID,
                text: message,
            })
        );
        return response.data;
    }
}
