import { PaginationSearchOptionsDto } from '@@/common/database/pagination-search-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum Period {
  THIS_YEAR = 'P1Y',
  THIS_MONTH = 'P1M',
  LAST_YEAR = 'P12M',
  LAST_MONTH = 'P30D',
  TWO_YEARS = 'P2Y',
  THREE_YEARS = 'P3Y',
  ALL = '',
}

export class DateFilterDto extends PaginationSearchOptionsDto {
  @IsEnum(Period)
  @IsOptional()
  @ApiPropertyOptional()
  period?: Period;
}
