import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './config/sequelize-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { VinylModule } from './vinyls/vinyl.module';
import { AppConfigModule } from './config/config.module';
import { HealthController } from './health/health.controller';
import { EmailService } from './purchases/email.service';
import { StripeService } from './purchases/stripe.service';
import { PurchaseModule } from './purchases/purchase.module';
import { ReviewModule } from './reviews/review.module';
import { LogModule } from './logs/log.module';

@Module({
    imports: [
        SequelizeModule.forRoot(config),
        AuthModule,
        UsersModule,
        VinylModule,
        PurchaseModule,
        ReviewModule,
        AppConfigModule,
        LogModule,
    ],
    controllers: [HealthController],
    providers: [EmailService, StripeService],
})
export class AppModule {}
