import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NextFunction, Request, Response } from 'express';

const AUTH_RATE_LIMIT_PATHS = new Set([
    '/api/auth/login',
    '/api/auth/register',
]);
const RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX = 10;
const WRITE_RATE_LIMIT_MAX = 20;

const REVIEW_CREATE_PATH = /^\/api\/vinyls\/\d+\/reviews$/;

interface RateLimitRule {
    key: string;
    max: number;
}

interface RateBucket {
    count: number;
    resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

function getRateLimitRule(method: string, path: string): RateLimitRule | null {
    const normalizedPath = path.replace(/\/+$/, '').toLowerCase();

    if (AUTH_RATE_LIMIT_PATHS.has(normalizedPath)) {
        return { key: 'auth', max: AUTH_RATE_LIMIT_MAX };
    }

    if (
        method === 'POST' &&
        (normalizedPath === '/api/purchases' ||
            REVIEW_CREATE_PATH.test(normalizedPath))
    ) {
        return {
            key: normalizedPath === '/api/purchases' ? 'purchase' : 'review',
            max: WRITE_RATE_LIMIT_MAX,
        };
    }

    return null;
}

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
    const isProduction = process.env.NODE_ENV === 'production';
    const allowed = getCorsOrigins();

    if (!origin) return true;
    // Fail closed in production when no explicit frontend origin is configured.
    if (allowed.length === 0) return !isProduction;

    return allowed.some((pattern) =>
        pattern === '*' ? !isProduction : matchesOrigin(origin, pattern)
    );
}

function securityHeaders(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    res.setHeader(
        'Content-Security-Policy',
        "frame-ancestors 'none'; base-uri 'self'; object-src 'none'"
    );
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (process.env.NODE_ENV === 'production') {
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    // Do not let browsers or proxies cache auth, profile or payment responses.
    if (
        /^\/(api\/)?(auth|users|purchases|logs)(\/|$)/i.test(req.path) ||
        /^\/api\/(auth|users|purchases|logs)(\/|$)/i.test(req.path)
    ) {
        res.setHeader('Cache-Control', 'no-store');
    }

    res.removeHeader('X-Powered-By');
    next();
}

function apiRateLimit(req: Request, res: Response, next: NextFunction): void {
    const rule = getRateLimitRule(req.method, req.path);
    if (!rule) {
        next();
        return;
    }

    const now = Date.now();
    if (rateBuckets.size > 10_000) {
        for (const [bucketKey, value] of rateBuckets) {
            if (value.resetAt <= now) rateBuckets.delete(bucketKey);
        }
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${rule.key}`;
    const bucket = rateBuckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        rateBuckets.set(key, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        next();
        return;
    }

    bucket.count += 1;
    if (bucket.count > rule.max) {
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
    app.use(apiRateLimit);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    const corsOptions: CorsOptions = {
        origin: (requestOrigin, callback) => {
            callback(null, isAllowedOrigin(requestOrigin));
        },
        credentials: true,
    };
    app.enableCors(corsOptions);

    const swaggerEnabled =
        process.env.SWAGGER_ENABLED === 'true' ||
        process.env.NODE_ENV !== 'production';

    if (swaggerEnabled) {
        const config = new DocumentBuilder()
            .setTitle('Vinyl Store API')
            .setDescription('Backend API for a vinyl records store')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(swaggerPath, app, document);
    }
}
