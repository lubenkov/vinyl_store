import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { logger } from '../common/utils/logger';

type GuardInfo = {
    message?: string;
    oauthError?: Record<string, unknown>;
};

function readInfo(info: unknown): GuardInfo {
    // Passport reports a failed verification as an array of challenges.
    if (Array.isArray(info) && info.length > 0) {
        return (info[0] ?? {}) as GuardInfo;
    }
    if (info && typeof info === 'object') {
        return info as GuardInfo;
    }
    return {};
}

@Injectable()
export class GoogleCallbackGuard extends AuthGuard('google') {
    handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext
    ): TUser {
        if (err || !user) {
            // Log the real reason: without it every OAuth failure looks the
            // same ("error=google") and the cause stays invisible.
            const details = readInfo(info);
            logger.error(
                `Google OAuth failed: ${
                    err?.message ?? details.message ?? 'unknown error'
                }`,
                err?.stack
            );
            if (err?.oauthError) {
                logger.error(
                    `Google OAuth provider response: ${JSON.stringify(
                        err.oauthError
                    )}`
                );
            }

            const response = context.switchToHttp().getResponse<Response>();
            const frontendUrl = (
                process.env.FRONTEND_URL ?? 'http://localhost:5173'
            ).replace(/\/+$/, '');
            const reason =
                details.message === 'account_exists'
                    ? 'google_account_exists'
                    : details.message === 'email_not_verified'
                      ? 'google_email_not_verified'
                      : 'google';

            response.redirect(
                `${frontendUrl}/login?error=${encodeURIComponent(reason)}`
            );
            return null as TUser;
        }

        return user as TUser;
    }
}
