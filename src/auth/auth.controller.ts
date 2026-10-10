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
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('google/callback')
    @ApiOperation({ summary: 'Handle Google OAuth callback and generate JWT' })
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
        const user = req.user;
        const jwt = this.authService.generateJwt(user);
        res.cookie('jwt', jwt, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        res.redirect('/users/profile');
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
