import { ProductCategory } from '@@/common/interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DateFilterDto } from './date-filter.dto';

export class GetOrdersFilterDto extends DateFilterDto {
  @IsEnum(ProductCategory)
  @IsOptional()
  @ApiPropertyOptional()
  category?: ProductCategory;
}
