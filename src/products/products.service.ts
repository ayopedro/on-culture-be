import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { AppUtilities } from '@@/common/utilities';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    let product: Product;
    const product_code = AppUtilities.generateProductCode(dto.name);

    try {
      const existingProduct = await this.prisma.product.findFirst({
        where: { product_code },
      });

      if (!existingProduct) {
        product = await this.prisma.product.create({
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

  async getProducts() {
    return await this.prisma.product.findMany({});
  }

  async getAllProductsSum() {
    const agg = await this.prisma.product.aggregate({
      _sum: { price: true },
    });

    return agg._sum.price || 0;
  }
}
