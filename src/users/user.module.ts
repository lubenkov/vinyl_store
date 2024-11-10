import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { JwtAuthModule } from '../jwt.module';
import { LogModule } from '../logs/log.module';

@Module({
    imports: [SequelizeModule.forFeature([User]), JwtAuthModule, LogModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
