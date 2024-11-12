import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TelegramService } from '../telegram/telegram.service';
import { TelegramController } from '../telegram/telegram.controller';
import { ConfigServiceImpl } from '../config/config.service';
import { JwtAuthModule } from '../jwt.module';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [HttpModule, UsersModule, JwtAuthModule],
    providers: [TelegramService, ConfigServiceImpl],
    controllers: [TelegramController],
})
export class TelegramModule {}
