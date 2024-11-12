import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Delete,
    Req,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @ApiOperation({ summary: 'Retrieve the profile of the current user' })
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usersService.getProfile(userId);
    }

    @Put('profile')
    @ApiOperation({
        summary: 'Update the profile information of the current user',
    })
    @UseGuards(AuthGuard)
    async updateProfile(
        @Req() req: any,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.userId;
        return this.usersService.updateProfile(userId, updateProfileDto);
    }

    @Delete('profile')
    @ApiOperation({ summary: 'Delete the profile of the current user' })
    @UseGuards(AuthGuard)
    async deleteProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usersService.deleteProfile(userId);
    }
}
