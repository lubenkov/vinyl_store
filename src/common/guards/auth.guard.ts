import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        const match = /^Bearer\s+(.+)$/i.exec(authHeader ?? '');
        const token = match?.[1];

        if (!token) {
            throw new UnauthorizedException('Access token is missing');
        }

        try {
            const payload = this.jwtService.verify<{ userId?: unknown }>(
                token,
                {
                    algorithms: ['HS256'],
                }
            );
            if (
                !payload ||
                typeof payload.userId !== 'number' ||
                !Number.isInteger(payload.userId) ||
                payload.userId <= 0
            ) {
                throw new Error('Invalid token payload');
            }
            (request as any).user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}
