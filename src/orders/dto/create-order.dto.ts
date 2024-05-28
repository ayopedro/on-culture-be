import { ProductCategory } from '@@/common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @ApiProperty()
  customer_name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  product_name: string;

  @IsEnum(ProductCategory)
  @ApiProperty()
  product_category: ProductCategory;

  @IsNumber()
  @ApiProperty()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  order_date?: string;
}
