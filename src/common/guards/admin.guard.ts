import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/user.service';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        const match = /^Bearer\s+(.+)$/i.exec(authHeader ?? '');
        const token = match?.[1];

        if (!token) {
            throw new UnauthorizedException('Access token is missing');
        }

        let payload: { userId: number };
        try {
            const verified = this.jwtService.verify<{ userId?: unknown }>(
                token,
                { algorithms: ['HS256'] }
            );
            if (
                !verified ||
                typeof verified.userId !== 'number' ||
                !Number.isInteger(verified.userId) ||
                verified.userId <= 0
            ) {
                throw new Error('Invalid token payload');
            }
            payload = { userId: verified.userId };
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }

        (request as any).user = payload;

        const user = await this.userService.getAuthUser(String(payload.userId));

        if (user.role !== 'admin') {
            throw new ForbiddenException('Admin access is required');
        }

        return true;
    }
}
