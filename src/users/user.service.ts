import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { Review } from '../models/review.model';
import { Purchase } from '../models/purchase.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from './dto/register.dto';
import { LogService } from '../logs/log.service';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        private logService: LogService
    ) {}

    async getProfile(userId: string): Promise<User> {
        const user = await this.userModel.findOne({
            where: { id: userId },
            // The password hash must never be sent to a client.
            attributes: { exclude: ['password'] },
            include: [{ model: Review }, { model: Purchase }],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async registerUser(registerDto: RegisterDto): Promise<User> {
        const existingUser = await this.userModel.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const newUserData: RegisterDto = { ...registerDto };
        if (newUserData.password) {
            newUserData.password = await bcrypt.hash(
                newUserData.password,
                BCRYPT_SALT_ROUNDS
            );
        }

        const user = await this.userModel.create({ ...newUserData });

        const userData = { ...user.dataValues };
        delete userData.password;
        await this.logService.createLog(
            `Register user: ${JSON.stringify(userData)}`
        );

        return user;
    }

    async updateProfile(
        userId: string,
        updateProfileDto: UpdateProfileDto
    ): Promise<User> {
        await this.userModel.update(
            { ...updateProfileDto },
            {
                where: { id: userId },
            }
        );

        const updatedUser = await this.userModel.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
        });

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        const userData = JSON.stringify(updatedUser.dataValues);
        await this.logService.createLog(`Update user: ${userData}`);

        return updatedUser;
    }

    async deleteProfile(userId: string): Promise<void> {
        const result = await this.userModel.destroy({ where: { id: userId } });
        if (result === 0) {
            throw new NotFoundException('User not found');
        }
        await this.logService.createLog(`Delete user with id ${userId}`);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ where: { email } });

        return user;
    }
}
