import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppConfigModule } from './config/config.module';
import { ConfigServiceImpl } from './config/config.service';
import { createSequelizeOptions } from './config/sequelize-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { VinylModule } from './vinyls/vinyl.module';
import { PurchaseModule } from './purchases/purchase.module';
import { ReviewModule } from './reviews/review.module';
import { HealthController } from './health/health.controller';
import { LogModule } from './logs/log.module';
import { DiscogsModule } from './discogs/discogs.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
    imports: [
        AppConfigModule,
        SequelizeModule.forRootAsync({
            inject: [ConfigServiceImpl],
            useFactory: createSequelizeOptions,
        }),
        AuthModule,
        UsersModule,
        VinylModule,
        PurchaseModule,
        ReviewModule,
        LogModule,
        DiscogsModule,
        TelegramModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
