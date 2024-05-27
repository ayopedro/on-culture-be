import { ProductCategory } from '@@/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty()
  order_number: number;

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

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  order_date?: string;
}
