import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, Max, Min } from 'class-validator';

export class CreatePurchaseDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(2_147_483_647)
    vinylId: number;

    @ApiProperty({ enum: ['usd'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value
    )
    @IsIn(['usd'])
    currency: string;
}
