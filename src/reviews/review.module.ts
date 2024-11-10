import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from '../models/review.model';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersModule } from '../users/user.module';
import { VinylModule } from '../vinyls/vinyl.module';
import { JwtAuthModule } from '../jwt.module';
import { LogModule } from '../logs/log.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Review]),
        UsersModule,
        forwardRef(() => VinylModule),
        JwtAuthModule,
        LogModule,
    ],
    providers: [ReviewService],
    controllers: [ReviewController],
    exports: [ReviewService],
})
export class ReviewModule {}
