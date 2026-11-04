import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    UseGuards,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleCallbackGuard } from './google-callback.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Log in with email and password and receive a JWT',
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('google')
    @ApiOperation({ summary: 'Initiate Google OAuth authentication' })
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @Get('google/callback')
    @ApiOperation({ summary: 'Handle Google OAuth callback and generate JWT' })
    @UseGuards(GoogleCallbackGuard)
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
        // The guard already redirected to the frontend on failed authentication.
        if (!req.user) return;

        const user = req.user;
        const jwt = this.authService.generateJwt(user);
        const frontendUrl = (
            process.env.FRONTEND_URL ?? 'http://localhost:5173'
        ).replace(/\/+$/, '');
        const state =
            typeof req.query?.state === 'string' ? req.query.state : undefined;
        const params = new URLSearchParams({ accessToken: jwt });
        if (state) params.set('state', state);

        res.cookie('jwt', jwt, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        res.redirect(
            `${frontendUrl}/auth/google/callback#${params.toString()}`
        );
    }

    @Get('logout')
    @ApiOperation({
        summary: 'Log out the current user by clearing the JWT cookie',
    })
    async logout(@Res() res: Response) {
        res.clearCookie('jwt');
        res.redirect('/');
    }
}
