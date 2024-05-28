import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { AppUtilities } from '@@/common/utilities';
import { Prisma } from '@prisma/client';
import { CrudService } from '@@/common/database/crud.service';
import { ProductMaptype } from './products.maptype';

@Injectable()
export class ProductsService extends CrudService<
  Prisma.ProductDelegate,
  ProductMaptype
> {
  constructor(private prisma: PrismaService) {
    super(prisma.product);
  }

  async createProduct(dto: CreateProductDto) {
    let product;
    const code = AppUtilities.generateProductCode(dto.name);

    try {
      const existingProduct = await this.findFirst({
        where: { code },
      });

      if (!existingProduct) {
        product = await this.create({
          data: { code, ...dto },
        });
      } else {
        product = existingProduct;
      }
    } catch (error) {
      throw new InternalServerErrorException('Product could not be created');
    }

    return product;
  }
}
