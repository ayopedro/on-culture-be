import { ProductCategory } from '@@/common/interfaces';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  order_number: number;

  @IsString()
  customer_name: string;

  @IsEmail()
  customer_email: string;

  @IsString()
  product_name: string;

  @IsEnum(ProductCategory)
  product_category: ProductCategory;

  @IsNumber()
  price: number;

  @IsDate()
  @Type(() => Date)
  order_date: string;
}
