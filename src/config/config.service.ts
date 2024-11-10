import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigServiceImpl {
    constructor(private configService: ConfigService) {}

    get databaseHost(): string {
        return this.configService.get<string>('DATABASE_HOST', 'localhost');
    }

    get databasePort(): number {
        return this.configService.get<number>('DATABASE_PORT', 5432);
    }

    get databaseUser(): string {
        return this.configService.get<string>('DATABASE_USER', 'root');
    }

    get databasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD', '');
    }

    get databaseName(): string {
        return this.configService.get<string>('DATABASE_NAME', 'test');
    }

    get jwtSecret(): string {
        return this.configService.get<string>(
            'JWT_SECRET',
            'default_jwt_secret'
        );
    }

    get stripeSecretKey(): string {
        return this.configService.get<string>(
            'STRIPE_SECRET_KEY',
            'default_stripe_key'
        );
    }

    get stripeVersion(): string {
        return this.configService.get<string>(
            'STRIPE_VERSION',
            'default_version'
        );
    }

    get emailService(): string {
        return this.configService.get<string>('EMAIL_SERVICE', 'gmail');
    }

    get emailUser(): string {
        return this.configService.get<string>(
            'EMAIL_USER',
            'example@gmail.com'
        );
    }

    get emailPass(): string {
        return this.configService.get<string>('EMAIL_PASS', '');
    }

    get googleClientId(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_ID', '');
    }

    get googleClientSecret(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_SECRET', '');
    }

    get googleCallbackUrl(): string {
        return this.configService.get<string>('GOOGLE_CALLBACK_URL', '');
    }
}
