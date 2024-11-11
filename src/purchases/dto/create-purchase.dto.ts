import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreatePurchaseDto {
    @ApiProperty()
    @IsInt()
    vinylId: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    amount: number;

    @ApiProperty()
    @IsString()
    currency: string;
}
