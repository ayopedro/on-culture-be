import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomersService } from '@@/customers/customers.service';
import { ProductsService } from '@@/products/products.service';
import moment from 'moment';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { BulkUploadOrders } from './dto/bulk-upload-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private customerService: CustomersService,
    private productService: ProductsService,
  ) {}

  async getSummary() {
    const [totalRevenue, totalOrders, uniqueCustomers] = await Promise.all([
      this.productService.getAllProductsSum(),
      this.getOrdersCount(),
      this.customerService.getCustomersCount(),
    ]);

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
    };
  }

  async getOrders() {
    return await this.prisma.order.findMany({
      where: {},
      include: { customer: true, product: true },
    });
  }

  async getOrdersCount() {
    const agg = await this.prisma.order.aggregate({
      _count: true,
    });

    return agg._count;
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: { customer: true, product: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrder(dto: CreateOrderDto) {
    return await this.prisma.$transaction(async (prisma: PrismaService) => {
      const customer = await this.customerService.createCustomer({
        name: dto.customer_name,
        email: dto.customer_email,
      });

      const product = await this.productService.createProduct({
        name: dto.product_name,
        category: dto.product_category,
        price: dto.price,
      });

      try {
        return await prisma.order.create({
          data: {
            orderNumber: dto.order_number,
            customer: { connect: { id: customer.id } },
            product: { connect: { id: product.id } },
            ...(dto.order_date && {
              createdAt: moment(dto.order_date).format(),
            }),
            createdBy: customer.id,
          },
        });
      } catch (error) {
        throw new ConflictException('Order number already exists');
      }
    });
  }

  async bulkUploadOrders({ orders }: BulkUploadOrders) {
    return await this.prisma.$transaction(async () => {
      for (const order of orders) {
        await this.createOrder(order);
      }
    });
  }
}
