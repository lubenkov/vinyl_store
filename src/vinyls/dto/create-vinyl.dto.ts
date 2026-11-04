import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsPositive,
    IsString,
    Max,
    MaxLength,
} from 'class-validator';

export class CreateVinylDto {
    @ApiProperty({ maxLength: 255 })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ maxLength: 255 })
    @IsString()
    @MaxLength(255)
    author: string;

    @ApiProperty({ maxLength: 5000 })
    @IsString()
    @MaxLength(5000)
    description: string;

    @ApiProperty({ maximum: 1000000 })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Max(1_000_000)
    price: number;

    @ApiProperty({ maxLength: 2048 })
    @IsString()
    @MaxLength(2048)
    image: string;
}
