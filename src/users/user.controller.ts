import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Query,
    Delete,
    Req,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usersService.getProfile(userId);
    }

    @Put('profile')
    @UseGuards(AuthGuard)
    async updateProfile(
        @Req() req: any,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.userId;
        return this.usersService.updateProfile(userId, updateProfileDto);
    }

    @Delete('profile')
    @UseGuards(AuthGuard)
    async deleteProfile(@Req() req: any) {
        const userId = req.user.userId;
        return this.usersService.deleteProfile(userId);
    }
}
