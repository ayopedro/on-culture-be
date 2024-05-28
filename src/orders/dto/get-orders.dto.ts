import { PaginationSearchOptionsDto } from '@@/common/database/pagination-search-options.dto';
import { ProductCategory } from '@@/common/interfaces';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetOrdersFilterDto extends PaginationSearchOptionsDto {
  @IsEnum(ProductCategory)
  @IsOptional()
  @ApiPropertyOptional()
  category?: ProductCategory;
}
