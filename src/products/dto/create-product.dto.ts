import { ProductCategory } from '@@/common/interfaces';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;
}
