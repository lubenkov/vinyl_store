import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NextFunction, Request, Response } from 'express';

const AUTH_RATE_LIMIT_PATHS = new Set([
    '/api/auth/login',
    '/api/auth/register',
]);
const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX = 10;

interface RateBucket {
    count: number;
    resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function getCorsOrigins(): string[] {
    return [process.env.CORS_ORIGINS, process.env.FRONTEND_URL]
        .filter((value): value is string => Boolean(value))
        .join(',')
        .split(',')
        .map((origin) => origin.trim().replace(/\/+$/, ''))
        .filter(Boolean);
}

function matchesOrigin(origin: string, pattern: string): boolean {
    if (pattern === '*') return true;
    if (!pattern.includes('*')) return origin === pattern;

    const escaped = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
    return new RegExp(`^${escaped}$`).test(origin);
}

export function isAllowedOrigin(origin: string | undefined): boolean {
    const allowed = getCorsOrigins();
    if (!origin || allowed.length === 0) return true;
    return allowed.some((pattern) => matchesOrigin(origin, pattern));
}

function securityHeaders(
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.removeHeader('X-Powered-By');
    next();
}

function authRateLimit(req: Request, res: Response, next: NextFunction): void {
    const path = req.path.replace(/\/+$/, '').toLowerCase();
    if (!AUTH_RATE_LIMIT_PATHS.has(path)) {
        next();
        return;
    }

    const now = Date.now();
    if (rateBuckets.size > 10_000) {
        for (const [bucketKey, value] of rateBuckets) {
            if (value.resetAt <= now) rateBuckets.delete(bucketKey);
        }
    }

    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const bucket = rateBuckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        rateBuckets.set(key, {
            count: 1,
            resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS,
        });
        next();
        return;
    }

    bucket.count += 1;
    if (bucket.count > AUTH_RATE_LIMIT_MAX) {
        res.setHeader(
            'Retry-After',
            String(Math.ceil((bucket.resetAt - now) / 1000))
        );
        res.status(429).json({
            statusCode: 429,
            message: 'Too many requests. Try again later.',
        });
        return;
    }

    next();
}

export function configureApp(app: INestApplication, swaggerPath: string): void {
    const server = app.getHttpAdapter().getInstance();
    if (typeof server.set === 'function') {
        server.set('trust proxy', 1);
    }
    if (typeof server.disable === 'function') {
        server.disable('x-powered-by');
    }

    app.use(securityHeaders);
    app.use(authRateLimit);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true })
    );

    const corsOptions: CorsOptions = {
        origin: (requestOrigin, callback) => {
            callback(null, isAllowedOrigin(requestOrigin));
        },
        credentials: true,
    };
    app.enableCors(corsOptions);

    const config = new DocumentBuilder()
        .setTitle('Vinyl Store API')
        .setDescription('Backend API for a vinyl records store')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
}
