import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    MaxLength,
} from 'class-validator';

export class UpdateVinylDto {
    @ApiPropertyOptional({ maxLength: 255 })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiPropertyOptional({ maxLength: 255 })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    author?: string;

    @ApiPropertyOptional({ maxLength: 5000 })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string;

    @ApiPropertyOptional({ maximum: 1000000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Max(1_000_000)
    price?: number;

    @ApiPropertyOptional({ maxLength: 2048 })
    @IsOptional()
    @IsString()
    @MaxLength(2048)
    image?: string;
}
