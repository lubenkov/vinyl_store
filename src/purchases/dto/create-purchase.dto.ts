import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class CreatePurchaseDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    vinylId: number;

    @ApiProperty()
    @IsString()
    currency: string;
}
