import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @ApiOperation({ summary: 'Initiate Google OAuth authentication' })
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {}

    @Get('google/callback')
    @ApiOperation({ summary: 'Handle Google OAuth callback and generate JWT' })
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const user = req.user;
        const jwt = this.authService.generateJwt(user);
        res.cookie('jwt', jwt);
        res.redirect('/users/profile');
    }
    @Get('logout')
    @ApiOperation({
        summary: 'Log out the current user by clearing the JWT cookie',
    })
    async logout(@Req() req: any, @Res() res: any) {
        res.clearCookie('jwt');
        res.redirect('/');
    }
}
