import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({ maxLength: 2000 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;

    @ApiProperty({ minimum: 1, maximum: 5 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    score: number;
}
