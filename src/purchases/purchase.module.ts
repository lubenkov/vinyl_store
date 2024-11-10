import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from '../models/purchase.model';
import { StripeService } from './stripe.service';
import { EmailService } from './email.service';
import { ConfigServiceImpl } from '../config/config.service';
import { UsersModule } from '../users/user.module';
import { JwtAuthModule } from '../jwt.module';
import { LogModule } from '../logs/log.module';

@Module({
    imports: [
        UsersModule,
        SequelizeModule.forFeature([Purchase]),
        JwtAuthModule,
        LogModule,
    ],
    providers: [
        PurchaseService,
        StripeService,
        EmailService,
        ConfigServiceImpl,
    ],
    controllers: [PurchaseController],
    exports: [PurchaseService],
})
export class PurchaseModule {}
