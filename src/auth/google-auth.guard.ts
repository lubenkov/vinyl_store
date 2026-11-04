import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    getAuthenticateOptions(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const state = request.query?.state;

        if (
            typeof state !== 'string' ||
            state.length < 16 ||
            state.length > 256
        ) {
            return undefined;
        }

        return { state };
    }
}
