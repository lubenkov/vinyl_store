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
            scope: [
                'email',
                'profile',
                'https://www.googleapis.com/auth/user.birthday.read',
            ],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { name, emails, photos, birthday } = profile;
        const email = emails[0].value;
        let user = await this.userService.findOneByEmail(email);

        if (!user) {
            user = await this.userService.registerUser({
                email: email,
                firstName: name.givenName,
                lastName: name.familyName,
                avatar: photos?.[0]?.value,
                birthdate: birthday ? birthday : null,
            });
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        done(null, payload);
    }
}
