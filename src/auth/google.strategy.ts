import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigServiceImpl } from '../config/config.service';
import { UsersService } from '../users/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigServiceImpl,
        private userService: UsersService
    ) {
        super({
            clientID: configService.googleClientId,
            clientSecret: configService.googleClientSecret,
            callbackURL: configService.googleCallbackUrl,
            // Basic scopes only: sensitive birthday access would require
            // Google OAuth verification before public use.
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const emailInfo = emails?.[0];
        if (!emailInfo?.value || emailInfo.verified !== true) {
            done(null, false, { message: 'email_not_verified' });
            return;
        }

        const email = emailInfo.value.trim().toLowerCase();
        let user = await this.userService.findOneByEmail(email);

        // Never auto-link Google to an existing password account: without a
        // verified local email that would allow account pre-hijacking.
        if (user?.password) {
            done(null, false, { message: 'account_exists' });
            return;
        }

        if (!user) {
            user = await this.userService.registerUser({
                email,
                firstName: name?.givenName ?? email.split('@')[0],
                lastName: name?.familyName ?? '',
                avatar: photos?.[0]?.value,
            });
        }
        done(null, { userId: user.id });
    }
}
