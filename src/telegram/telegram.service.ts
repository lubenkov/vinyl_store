import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigServiceImpl } from '../config/config.service';
import { SendVinylDto } from './dto/send-vinyl.dto';

@Injectable()
export class TelegramService {
    private readonly BOT_TOKEN: string;
    private readonly CHAT_ID: string;
    private readonly BASE_URL: string;

    constructor(
        private httpService: HttpService,
        private configService: ConfigServiceImpl
    ) {
        this.BOT_TOKEN = this.configService.telegramBotToken;
        this.CHAT_ID = this.configService.telegramChatId;
        this.BASE_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}`;
    }

    async sendVinylRecord(record: SendVinylDto): Promise<any> {
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
