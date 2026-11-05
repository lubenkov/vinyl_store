import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsString,
    IsUrl,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class SendVinylDto {
    @ApiProperty({ maxLength: 255 })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({ maxLength: 2048 })
    @IsUrl({
        require_protocol: true,
        protocols: ['http', 'https'],
        require_tld: false,
    })
    @MaxLength(2048)
    link: string;

    @ApiProperty({ maximum: 1000000 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    price: number;
}
