import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
        const user = await this.usersService.registerUser(registerDto);
        return { accessToken: this.generateJwt({ userId: user.id }) };
    }

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOneByEmail(loginDto.email);

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return { accessToken: this.generateJwt({ userId: user.id }) };
    }

    generateJwt(user: { userId: number }): string {
        const payload = { userId: user.userId };
        return this.jwtService.sign(payload);
    }
}
