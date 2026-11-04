import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
    handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext
    ): TUser {
        if (err || !user) {
            const response = context.switchToHttp().getResponse<Response>();
            const frontendUrl = (
                process.env.FRONTEND_URL ?? 'http://localhost:5173'
            ).replace(/\/+$/, '');
            const reason =
                info?.message === 'account_exists'
                    ? 'google_account_exists'
                    : 'google';
            response.redirect(
                `${frontendUrl}/login?error=${encodeURIComponent(reason)}`
            );
            return null as TUser;
        }

        return user as TUser;
    }
}
