import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from '../models/purchase.model';
import { Vinyl } from '../models/vinyl.model';
import { StripeService } from './stripe.service';
import { EmailService } from './email.service';
import { UsersModule } from '../users/user.module';
import { JwtAuthModule } from '../jwt.module';
import { LogModule } from '../logs/log.module';

@Module({
    imports: [
        UsersModule,
        SequelizeModule.forFeature([Purchase, Vinyl]),
        JwtAuthModule,
        LogModule,
    ],
    providers: [PurchaseService, StripeService, EmailService],
    controllers: [PurchaseController],
    exports: [PurchaseService],
})
export class PurchaseModule {}
