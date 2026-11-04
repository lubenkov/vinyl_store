import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class PaginationDto {
    @ApiPropertyOptional({ default: 10, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiPropertyOptional({ default: 0, maximum: 100000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100_000)
    offset?: number;

    @ApiPropertyOptional({ default: 'name' })
    @IsOptional()
    @IsString()
    @MaxLength(32)
    sortBy?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';

    @ApiPropertyOptional({ enum: ['name', 'author'] })
    @IsOptional()
    @IsString()
    @MaxLength(32)
    searchBy?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    searchTerm?: string;
}
