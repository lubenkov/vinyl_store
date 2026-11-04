import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

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

    @ApiProperty({ minLength: 8, maxLength: 72 })
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}
