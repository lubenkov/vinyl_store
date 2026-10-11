import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateVinylDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty()
    @IsString()
    image: string;
}
