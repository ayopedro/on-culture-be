import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '@@/common/database/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    return await this.prisma.product.create({ data: dto });
  }

  async getProducts() {
    return await this.prisma.product.findMany({});
  }

  async getAllProductsSum() {
    return await this.prisma.product.aggregate({
      _sum: { price: true },
    });
  }
}
