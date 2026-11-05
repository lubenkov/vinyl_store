import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStrategy } from '../../src/auth/google.strategy';
import { ConfigServiceImpl } from '../../src/config/config.service';
import { UsersService } from '../../src/users/user.service';

const profile = {
    name: { givenName: 'Ada', familyName: 'Lovelace' },
    emails: [{ value: 'Ada@Example.com', verified: true }],
    photos: [{ value: 'https://example.com/a.png' }],
};

describe('GoogleStrategy', () => {
    let strategy: GoogleStrategy;
    let userService: any;

    beforeEach(async () => {
        userService = {
            findOneByEmail: jest.fn(),
            registerUser: jest.fn(),
        };

        const configService = {
            googleClientId: 'test-client-id',
            googleClientSecret: 'test-client-secret',
            googleCallbackUrl:
                'https://api.example.com/api/auth/google/callback',
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleStrategy,
                { provide: UsersService, useValue: userService },
                { provide: ConfigServiceImpl, useValue: configService },
            ],
        }).compile();

        strategy = module.get<GoogleStrategy>(GoogleStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    // @nestjs/passport calls the passport `done()` callback itself after
    // awaiting validate(). A validate() that calls done() as well makes
    // passport authenticate twice: the second call carries an undefined user,
    // which the callback guard treats as a failure.
    it('must not accept a done() callback', () => {
        expect(GoogleStrategy.prototype.validate.length).toBe(3);
    });

    it('should return the user id for a verified google account', async () => {
        userService.findOneByEmail.mockResolvedValue({ id: 7 });

        await expect(
            strategy.validate('token', 'refresh', profile)
        ).resolves.toEqual({ userId: 7 });
    });

    it('should register the user on the first google login', async () => {
        userService.findOneByEmail.mockResolvedValue(null);
        userService.registerUser.mockResolvedValue({ id: 9 });

        await expect(
            strategy.validate('token', 'refresh', profile)
        ).resolves.toEqual({ userId: 9 });
        expect(userService.registerUser).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'ada@example.com' })
        );
    });

    it('should reject an unverified email', async () => {
        await expect(
            strategy.validate('token', 'refresh', {
                ...profile,
                emails: [{ value: 'ada@example.com', verified: false }],
            })
        ).rejects.toThrow('email_not_verified');
    });

    it('should reject a google login for an existing password account', async () => {
        userService.findOneByEmail.mockResolvedValue({
            id: 7,
            password: 'hashed-password',
        });

        await expect(
            strategy.validate('token', 'refresh', profile)
        ).rejects.toThrow('account_exists');
    });
});
