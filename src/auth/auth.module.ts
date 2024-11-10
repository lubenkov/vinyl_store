import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from '../jwt.module';
import { GoogleStrategy } from './google.strategy';
import { ConfigServiceImpl } from '../config/config.service';

@Module({
    imports: [UsersModule, PassportModule, JwtAuthModule],
    providers: [AuthService, GoogleStrategy, ConfigServiceImpl],
    controllers: [AuthController],
})
export class AuthModule {}
