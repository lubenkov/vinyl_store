import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigServiceImpl {
    constructor(private configService: ConfigService) {}

    get databaseHost(): string {
        return this.configService.get<string>('DATABASE_HOST', 'localhost');
    }

    get databasePort(): number {
        return this.configService.get<number>('DATABASE_PORT', 3306);
    }

    get databaseUser(): string {
        return this.configService.get<string>('DATABASE_USER', 'root');
    }

    get databasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD', '');
    }

    get databaseName(): string {
        return this.configService.get<string>('DATABASE_NAME', 'vinyl_store');
    }

    get databaseSsl(): boolean {
        return this.configService.get<boolean>('DATABASE_SSL', false);
    }

    get databasePoolMax(): number {
        return this.configService.get<number>('DATABASE_POOL_MAX', 5);
    }

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET')!;
    }

    get stripeSecretKey(): string {
        return this.configService.get<string>('STRIPE_SECRET_KEY')!;
    }

    get stripeDemoMode(): boolean {
        const key = this.stripeSecretKey;
        return (
            !key ||
            key === 'disabled' ||
            key === 'sk_test_replace_me' ||
            key.startsWith('sk_test_dummy')
        );
    }

    get emailService(): string {
        return this.configService.get<string>('EMAIL_SERVICE', 'gmail');
    }

    get emailUser(): string {
        return this.configService.get<string>('EMAIL_USER')!;
    }

    get emailPass(): string {
        return this.configService.get<string>('EMAIL_PASS')!;
    }

    get googleClientId(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_ID')!;
    }

    get googleClientSecret(): string {
        return this.configService.get<string>('GOOGLE_CLIENT_SECRET')!;
    }

    get googleCallbackUrl(): string {
        return this.configService.get<string>('GOOGLE_CALLBACK_URL')!;
    }

    get telegramBotToken(): string {
        return this.configService.get<string>('TELEGRAM_BOT_TOKEN')!;
    }

    get telegramChatId(): string {
        return this.configService.get<string>('TELEGRAM_CHAT_ID')!;
    }

    get discogsKey(): string {
        return this.configService.get<string>('DISCOGS_KEY')!;
    }

    get discogsSecret(): string {
        return this.configService.get<string>('DISCOGS_SECRET')!;
    }
}
