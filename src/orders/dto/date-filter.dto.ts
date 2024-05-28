import { PaginationSearchOptionsDto } from '@@/common/database/pagination-search-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum Period {
  THIS_YEAR = 'P12M',
  THIS_MONTH = 'P30D',
  LAST_YEAR = 'P1Y',
  LAST_MONTH = 'P1M',
  TWO_YEARS = 'P2Y',
  THREE_YEARS = 'P3Y',
}

export class DateFilterDto extends PaginationSearchOptionsDto {
  @IsEnum(Period)
  @IsOptional()
  @ApiPropertyOptional()
  period?: Period;
}
