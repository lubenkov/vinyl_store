import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;
    let userService: any;
    let jwtService: any;

    beforeEach(async () => {
        userService = {
            findOneByEmail: jest.fn(),
        };

        jwtService = {
            sign: jest.fn(),
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
});
