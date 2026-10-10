import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    IsOptional,
    IsDateString,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false, minLength: 8 })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    birthdate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    avatar?: string;
}
