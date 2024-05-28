import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBase64,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SortDirection } from '../interfaces';

export class PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsBase64()
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  size?: number;

  @ApiHideProperty()
  @IsOptional()
  orderBy?: string;

  @IsEnum(SortDirection)
  @IsOptional()
  @ApiPropertyOptional()
  direction?: SortDirection = SortDirection.DESC;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  isPaginated?: string = 'true';
}
