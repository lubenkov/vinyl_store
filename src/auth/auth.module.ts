import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from '../jwt.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleCallbackGuard } from './google-callback.guard';

@Module({
    imports: [UsersModule, PassportModule, JwtAuthModule],
    providers: [
        AuthService,
        GoogleStrategy,
        GoogleAuthGuard,
        GoogleCallbackGuard,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
