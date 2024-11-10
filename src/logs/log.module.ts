import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from '../models/log.model';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { JwtAuthModule } from '../jwt.module';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Log]),
        JwtAuthModule,
        forwardRef(() => UsersModule),
    ],
    providers: [LogService],
    controllers: [LogController],
    exports: [LogService],
})
export class LogModule {}
