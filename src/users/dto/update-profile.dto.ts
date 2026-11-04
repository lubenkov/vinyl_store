import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsDateString()
    @MaxLength(40)
    @IsOptional()
    birthdate?: string;

    @ApiProperty()
    @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
    @MaxLength(2048)
    @IsOptional()
    avatar?: string;
}
