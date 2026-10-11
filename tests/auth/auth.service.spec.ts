import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/user.service';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('AuthService', () => {
    let service: AuthService;
    let userService: any;
    let jwtService: any;

    beforeEach(async () => {
        userService = {
            registerUser: jest.fn(),
            findOneByEmail: jest.fn(),
        };

        jwtService = {
            sign: jest.fn().mockReturnValue('test-jwt-token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: userService,
                },
                {
                    provide: JwtService,
                    useValue: jwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateJwt', () => {
        it('should generate a JWT for a given user', () => {
            const user = { userId: 1 };
            const token = 'test-jwt-token';

            jwtService.sign.mockReturnValue(token);

            const result = service.generateJwt(user);

            expect(result).toBe(token);
            expect(jwtService.sign).toHaveBeenCalledWith({
                userId: user.userId,
            });
        });
    });

    describe('register', () => {
        it('should register a user and return an access token', async () => {
            const registerDto: RegisterDto = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@gmail.com',
                password: 'password123',
            };
            userService.registerUser.mockResolvedValue({ id: 1 });

            const result = await service.register(registerDto);

            expect(userService.registerUser).toHaveBeenCalledWith(registerDto);
            expect(jwtService.sign).toHaveBeenCalledWith({ userId: 1 });
            expect(result).toEqual({ accessToken: 'test-jwt-token' });
        });
    });

    describe('login', () => {
        const loginDto: LoginDto = {
            email: 'test@gmail.com',
            password: 'password123',
        };

        it('should return an access token for valid credentials', async () => {
            const passwordHash = await bcrypt.hash(loginDto.password, 4);
            userService.findOneByEmail.mockResolvedValue({
                id: 1,
                email: loginDto.email,
                password: passwordHash,
            });

            const result = await service.login(loginDto);

            expect(userService.findOneByEmail).toHaveBeenCalledWith(
                loginDto.email
            );
            expect(jwtService.sign).toHaveBeenCalledWith({ userId: 1 });
            expect(result).toEqual({ accessToken: 'test-jwt-token' });
        });

        it('should throw UnauthorizedException for an unknown email', async () => {
            userService.findOneByEmail.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException
            );
        });

        it('should throw UnauthorizedException for a wrong password', async () => {
            const passwordHash = await bcrypt.hash('another-password', 4);
            userService.findOneByEmail.mockResolvedValue({
                id: 1,
                email: loginDto.email,
                password: passwordHash,
            });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException
            );
        });

        it('should throw UnauthorizedException for an account without a password (Google sign-in)', async () => {
            userService.findOneByEmail.mockResolvedValue({
                id: 1,
                email: loginDto.email,
                password: null,
            });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException
            );
        });
    });
});
