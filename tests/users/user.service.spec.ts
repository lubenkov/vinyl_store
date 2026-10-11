import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../src/users/user.service';
import { User } from '../../src/models/user.model';
import { Review } from '../../src/models/review.model';
import { Purchase } from '../../src/models/purchase.model';
import { LogService } from '../../src/logs/log.service';
import { RegisterDto } from '../../src/users/dto/register.dto';
import { UpdateProfileDto } from '../../src/users/dto/update-profile.dto';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: any;
    let logService: any;

    beforeEach(async () => {
        userModel = {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        };

        logService = {
            createLog: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User),
                    useValue: userModel,
                },
                {
                    provide: LogService,
                    useValue: logService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return user profile without the password hash', async () => {
            const user = { id: '1', name: 'Test User' };
            userModel.findOne.mockResolvedValue(user);

            const result = await service.getProfile('1');

            expect(result).toEqual(user);
            expect(userModel.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                attributes: { exclude: ['password'] },
                include: [{ model: Review }, { model: Purchase }],
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            userModel.findOne.mockResolvedValue(null);

            await expect(service.getProfile('1')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('registerUser', () => {
        const registerDto: RegisterDto = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@gmail.com',
        };

        it('should register a new user and log the action', async () => {
            const createdUser = {
                ...registerDto,
                id: '1',
                dataValues: { ...registerDto, id: '1' },
            };

            userModel.findOne.mockResolvedValue(null);
            userModel.create.mockResolvedValue(createdUser);

            const result = await service.registerUser(registerDto);

            expect(result).toEqual(createdUser);
            expect(userModel.create).toHaveBeenCalledWith(registerDto);
            expect(logService.createLog).toHaveBeenCalledWith(
                `Register user: ${JSON.stringify(createdUser.dataValues)}`
            );
        });

        it('should throw ConflictException for a duplicate email', async () => {
            userModel.findOne.mockResolvedValue({ id: '1' });

            await expect(service.registerUser(registerDto)).rejects.toThrow(
                ConflictException
            );
            expect(userModel.create).not.toHaveBeenCalled();
        });

        it('should store the password as a bcrypt hash', async () => {
            const dtoWithPassword: RegisterDto = {
                ...registerDto,
                password: 'password123',
            };
            userModel.findOne.mockResolvedValue(null);
            userModel.create.mockImplementation(async (data: any) => ({
                ...data,
                id: '1',
                dataValues: { ...data, id: '1' },
            }));

            await service.registerUser(dtoWithPassword);

            const savedUser = userModel.create.mock.calls[0][0];
            expect(savedUser.password).not.toBe(dtoWithPassword.password);
            expect(
                await bcrypt.compare(
                    dtoWithPassword.password!,
                    savedUser.password
                )
            ).toBe(true);
        });

        it('should never write the password hash to the log', async () => {
            const dtoWithPassword: RegisterDto = {
                ...registerDto,
                password: 'password123',
            };
            userModel.findOne.mockResolvedValue(null);
            userModel.create.mockImplementation(async (data: any) => ({
                ...data,
                id: '1',
                dataValues: { ...data, id: '1' },
            }));

            await service.registerUser(dtoWithPassword);

            const loggedAction = logService.createLog.mock.calls[0][0];
            expect(loggedAction).toContain('Register user:');
            expect(loggedAction).not.toContain('password');
        });
    });

    describe('updateProfile', () => {
        it('should update user profile', async () => {
            const updateProfileDto: UpdateProfileDto = {
                firstName: 'Updated',
                lastName: 'User',
                birthdate: '2000-01-01',
                avatar: 'avatar-url',
            };

            const updatedUser = {
                ...updateProfileDto,
                id: '1',
                dataValues: { ...updateProfileDto, id: '1' },
            };

            userModel.update.mockResolvedValue([1]);
            userModel.findOne.mockResolvedValue(updatedUser);

            const result = await service.updateProfile('1', updateProfileDto);

            expect(result).toEqual(updatedUser);
            expect(userModel.update).toHaveBeenCalledWith(updateProfileDto, {
                where: { id: '1' },
            });
            expect(logService.createLog).toHaveBeenCalledWith(
                `Update user: ${JSON.stringify(updatedUser.dataValues)}`
            );
        });

        it('should throw NotFoundException if user not found', async () => {
            userModel.update.mockResolvedValue([0]);

            await expect(
                service.updateProfile('1', { firstName: 'Updated' })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteProfile', () => {
        it('should delete user profile and create log', async () => {
            userModel.destroy.mockResolvedValue(1);

            await service.deleteProfile('1');

            expect(userModel.destroy).toHaveBeenCalledWith({
                where: { id: '1' },
            });
            expect(logService.createLog).toHaveBeenCalledWith(
                'Delete user with id 1'
            );
        });

        it('should throw NotFoundException if user not found', async () => {
            userModel.destroy.mockResolvedValue(0);

            await expect(service.deleteProfile('1')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('findOneByEmail', () => {
        it('should find user by email', async () => {
            const user = { id: '1', email: 'test@gmail.com' };
            userModel.findOne.mockResolvedValue(user);

            const result = await service.findOneByEmail('test@gmail.com');

            expect(result).toEqual(user);
            expect(userModel.findOne).toHaveBeenCalledWith({
                where: { email: 'test@gmail.com' },
            });
        });
    });
});
