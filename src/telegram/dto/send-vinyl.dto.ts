import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUrl, Min } from 'class-validator';

export class SendVinylDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsUrl()
    link: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;
}
