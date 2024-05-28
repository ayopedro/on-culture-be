import { ProductCategory } from '@@/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  matches,
} from 'class-validator';
import * as moment from 'moment';

export class CreateOrderDto {
  @IsString()
  @ApiProperty()
  customer_name: string;

  @IsEmail()
  @ApiProperty()
  customer_email: string;

  @IsString()
  @ApiProperty()
  product_name: string;

  @IsEnum(ProductCategory)
  @ApiProperty()
  product_category: ProductCategory;

  @IsNumber()
  @ApiProperty()
  price: number;

  @Transform(({ value }) => {
    const dayFirstMatch = matches(
      value,
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    );
    return !dayFirstMatch ? value : moment(value, 'DD/MM/YYYY').toDate();
  })
  @ApiProperty()
  @IsOptional()
  @IsDate()
  order_date?: string;
}
