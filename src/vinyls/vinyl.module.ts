import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtAuthModule } from '../jwt.module';
import { Vinyl } from '../models/vinyl.model';
import { Review } from '../models/review.model';
import { UsersModule } from '../users/user.module';
import { LogModule } from '../logs/log.module';
import { ReviewModule } from '../reviews/review.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Vinyl, Review]),
        JwtAuthModule,
        UsersModule,
        LogModule,
        ReviewModule,
    ],
    providers: [VinylService],
    controllers: [VinylController],
    exports: [VinylService],
})
export class VinylModule {}
