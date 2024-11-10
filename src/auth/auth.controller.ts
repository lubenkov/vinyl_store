import {
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    Body,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const user = req.user;
        const jwt = this.authService.generateJwt(user);
        res.cookie('jwt', jwt);
        res.redirect('/users/profile');
    }
    @Get('logout') async logout(@Req() req: any, @Res() res: any) {
        res.clearCookie('jwt');
        res.redirect('/');
    }
}
