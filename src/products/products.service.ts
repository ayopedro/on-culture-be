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
    const product_code = AppUtilities.generateProductCode(dto.name);

    try {
      const existingProduct = await this.findFirst({
        where: { product_code },
      });

      if (!existingProduct) {
        product = await this.create({
          data: { product_code, ...dto },
        });
      } else {
        product = existingProduct;
      }
    } catch (error) {
      throw new InternalServerErrorException('Product could not be created');
    }

    return product;
  }

  async getAllProductsSum() {
    const agg = (await this.aggregate({
      _sum: { price: true },
    })) as { _sum: { price: number } };

    return agg._sum.price || 0;
  }
}
