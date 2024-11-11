import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    birthdate?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    avatar?: string;
}
