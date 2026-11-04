import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    firstName: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    lastName: string;

    @ApiProperty()
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({ required: false, minLength: 8, maxLength: 72 })
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    @MaxLength(40)
    birthdate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
    @MaxLength(2048)
    avatar?: string;
}
