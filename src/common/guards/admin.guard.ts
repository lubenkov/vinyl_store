import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token);
            const userId = payload.userId;

            (request as any).user = payload;

            const user = await this.userService.getProfile(userId);

            if (user.role !== 'admin') return false;

            return true;
        } catch {
            return false;
        }
    }
}
