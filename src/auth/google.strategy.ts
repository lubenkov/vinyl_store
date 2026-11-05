import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
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

    // IMPORTANT: @nestjs/passport wraps this method and calls the passport
    // `done()` callback itself after awaiting the returned value. Calling
    // `done()` here as well would authenticate twice: the second call carries
    // an undefined user, passport treats it as a failure and the callback
    // guard redirects to /login?error=google even though the login succeeded.
    // So: return the user, throw to reject.
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any
    ): Promise<{ userId: number }> {
        const { name, emails, photos } = profile;
        const emailInfo = emails?.[0];
        if (!emailInfo?.value || emailInfo.verified !== true) {
            throw new Error('email_not_verified');
        }

        const email = emailInfo.value.trim().toLowerCase();
        let user = await this.userService.findOneByEmail(email);

        // Never auto-link Google to an existing password account: without a
        // verified local email that would allow account pre-hijacking.
        if (user?.password) {
            throw new Error('account_exists');
        }

        if (!user) {
            user = await this.userService.registerUser({
                email,
                firstName: name?.givenName ?? email.split('@')[0],
                lastName: name?.familyName ?? '',
                avatar: photos?.[0]?.value,
            });
        }

        return { userId: user.id };
    }
}
