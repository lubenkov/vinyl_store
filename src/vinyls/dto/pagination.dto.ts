import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class PaginationDto {
    @ApiProperty()
    @IsOptional()
    @IsInt()
    limit: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    offset: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sortBy: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    order: 'ASC' | 'DESC';

    @ApiProperty()
    @IsOptional()
    @IsString()
    searchBy?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    searchTerm?: string;
}
