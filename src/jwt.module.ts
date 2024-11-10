import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigServiceImpl } from './config/config.service';
import { AppConfigModule } from './config/config.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            inject: [ConfigServiceImpl],
            useFactory: async (configService: ConfigServiceImpl) => ({
                secret: configService.jwtSecret,
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    providers: [ConfigServiceImpl],
    exports: [JwtModule],
})
export class JwtAuthModule {}
