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

  async getProductCategoryData(ordersId: Record<string, string>[]) {
    const products = await this.findMany({
      where: {
        orders: {
          some: {
            id: {
              in: ordersId.map(({ id }) => id),
            },
          },
        },
      },
      select: {
        category: true,
      },
    });

    return products.reduce((acc, item) => {
      const categoryObj = acc.find((obj) => obj.name === item.category);

      if (categoryObj) {
        categoryObj.count++;
      } else {
        acc.push({ name: item.category, count: 1 });
      }
      return acc;
    }, []);
  }
}
