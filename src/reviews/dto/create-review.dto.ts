import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    score: number;

    @ApiProperty()
    @IsInt()
    userId: number;

    @ApiProperty()
    @IsInt()
    vinylId: number;
}
