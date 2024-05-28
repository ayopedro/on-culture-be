import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomersService } from '@@/customers/customers.service';
import { ProductsService } from '@@/products/products.service';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { BulkUploadOrders } from './dto/bulk-upload-order.dto';
import { CrudService } from '@@/common/database/crud.service';
import { OrderMaptype } from './orders.maptype';
import { Prisma } from '@prisma/client';
import { GetOrdersFilterDto } from './dto/get-orders.dto';
import { DateFilterDto, Period } from './dto/date-filter.dto';
import { AppUtilities } from '@@/common/utilities';
import { DateRangeMap } from '@@/common/constant';

@Injectable()
export class OrdersService extends CrudService<
  Prisma.OrderDelegate,
  OrderMaptype
> {
  constructor(
    private prisma: PrismaService,
    private customerService: CustomersService,
    private productService: ProductsService,
  ) {
    super(prisma.order);
  }

  async getSummary(dto: DateFilterDto) {
    const duration = await this.getDateRange(dto.period);

    const whereClause = Object.keys(duration || {}).length
      ? {
          AND: [
            {
              date: { gte: duration.startDate },
            },
            {
              date: { lte: duration.endDate },
            },
          ],
        }
      : {};

    const [totalRevenue, totalOrders, uniqueCustomers] = await Promise.all([
      this.getOrdersRevenue(whereClause),
      this.getOrdersCount(whereClause),
      this.customerService.getCustomersCount(duration),
    ]);

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
    };
  }

  async getOrders(dto: GetOrdersFilterDto) {
    const duration = await this.getDateRange(dto.period);

    const whereClause = Object.keys(duration || {}).length
      ? {
          AND: [
            {
              date: { gte: duration.startDate },
            },
            {
              date: { lte: duration.endDate },
            },
          ],
        }
      : {};

    const parseSplittedTermsQuery = (term: string) => {
      return {
        OR: [
          {
            product: {
              name: { contains: term, mode: 'insensitive' },
            },
          },
          {
            customer: {
              name: { contains: term, mode: 'insensitive' },
            },
          },
        ],
      };
    };

    const parsedQueryFilters = this.parseQueryFilter(dto, [
      'product.category|equals',
      {
        key: 'term',
        where: parseSplittedTermsQuery,
      },
    ]);

    return await this.findManyPaginate({
      where: { ...whereClause, ...parsedQueryFilters },
      include: { customer: true, product: true },
    });
  }

  async getOrdersCount(where: Record<any, any>) {
    const agg = await this.aggregate({
      where,
      _count: true,
    });

    return (agg as { _count: number })._count;
  }

  async getOrdersRevenue(where: Record<any, any>) {
    let orders = await this.findMany({
      where,
      select: { product: { select: { price: true } } },
    });

    orders = orders.map((order) => order.product);

    return orders.reduce((acc, item) => {
      acc += item.price;
      return acc;
    }, 0);
  }

  async getOrder(id: string) {
    const order = await this.findFirst({
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
        await prisma.order.create({
          data: {
            customer: { connect: { id: customer.id } },
            product: { connect: { id: product.id } },
            ...(dto.order_date && {
              date: dto.order_date,
            }),
            createdBy: customer.id,
          },
        });
      } catch (error) {
        throw new BadRequestException(error.message);
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

  async getDateRange(period: Period) {
    const range =
      period !== Period.ALL && AppUtilities.generateDateRange(period);
    return {
      startDate: range[DateRangeMap[period]?.startDate],
      endDate: range[DateRangeMap[period]?.endDate],
    };
  }
}
