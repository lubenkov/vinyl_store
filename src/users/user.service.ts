import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from './dto/register.dto';
import { LogService } from '../logs/log.service';

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
            include: ['reviews', 'purchases'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async registerUser(registerDto: RegisterDto): Promise<User> {
        const user = await this.userModel.create({ ...registerDto });
        const userData = JSON.stringify(user.dataValues);
        await this.logService.createLog(`Update user: ${userData}`);

        return user;
    }

    async updateProfile(
        userId: string,
        updateProfileDto: UpdateProfileDto
    ): Promise<User> {
        const [numberOfAffectedRows] = await this.userModel.update(
            { ...updateProfileDto },
            {
                where: { id: userId },
            }
        );

        const updatedUser = await this.userModel.findOne({
            where: { id: userId },
        });

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        const userData = JSON.stringify(updatedUser.dataValues);
        await this.logService.createLog(`Update vinyl: ${userData}`);

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
