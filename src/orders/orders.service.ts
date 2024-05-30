import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomersService } from '@@/customers/customers.service';
import { ProductsService } from '@@/products/products.service';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { BulkUploadOrdersDto } from './dto/bulk-upload-order.dto';
import { CrudService } from '@@/common/database/crud.service';
import { OrderMaptype } from './orders.maptype';
import { Prisma } from '@prisma/client';
import { GetOrdersFilterDto } from './dto/get-orders.dto';
import { DateFilterDto, Period } from './dto/date-filter.dto';
import { AppUtilities } from '@@/common/utilities';
import { DateRangeMap } from '@@/common/constant';
import { isEmail, isEnum, isNotEmpty, isNumber } from 'class-validator';
import { PreviousDataDate, ProductCategory } from '@@/common/interfaces';
import { OrderUploadReasons } from './interface';
import * as moment from 'moment';

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

    const previous: PreviousDataDate = {
      startDate: duration.previousStart,
      endDate: duration.previousEnd,
    };

    const [totalRevenue, totalOrders, uniqueCustomers] = await Promise.all([
      this.getOrdersRevenue(whereClause, previous),
      this.getOrdersCount(whereClause, previous),
      this.customerService.getCustomersCount(duration, previous),
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

    const args: Prisma.OrderFindManyArgs = {
      where: {
        ...whereClause,
        ...parsedQueryFilters,
      },
      include: { customer: true, product: true },
    };

    return await this.findManyPaginate(args, {
      ...dto,
    });
  }

  async getOrdersCount(where: Record<any, any>, previous?: PreviousDataDate) {
    const currAgg = await this.aggregate({
      where,
      _count: true,
    });

    let prevAgg = {};

    if (previous?.startDate)
      prevAgg = await this.aggregate({
        where: {
          AND: [
            {
              date: { gte: previous.startDate },
            },
            {
              date: { lte: previous.endDate },
            },
          ],
        },
        _count: true,
      });

    const currCount = (currAgg as any)._count;
    const prevCount = (prevAgg as any)._count || 0;

    const difference = AppUtilities.calculatePeriodDiff(currCount, prevCount);

    return {
      current: currCount,
      difference,
    };
  }

  async getOrdersRevenue(where: Record<any, any>, previous?: PreviousDataDate) {
    let currentOrders = await this.findMany({
      where,
      select: { product: { select: { price: true } } },
    });

    let previousOrders = [];

    if (previous?.startDate)
      previousOrders = await this.findMany({
        where: {
          AND: [
            {
              date: { gte: previous.startDate },
            },
            {
              date: { lte: previous.endDate },
            },
          ],
        },
        select: { product: { select: { price: true } } },
      });

    currentOrders = currentOrders.map((order) => order.product);
    previousOrders = previousOrders.map((order) => order.product);

    const currentOrdersCount = currentOrders.reduce(
      (acc, item) => (acc += item.price),
      0,
    );

    const previousOrdersCount = previousOrders.reduce(
      (acc, item) => (acc += item.price),
      0,
    );

    const difference = AppUtilities.calculatePeriodDiff(
      currentOrdersCount,
      previousOrdersCount,
    );

    return {
      current: currentOrdersCount,
      difference,
    };
  }

  async getRevenueBreakdown(dto: DateFilterDto) {
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
    try {
      const revenueData = await this.findMany({
        where: whereClause,
        select: {
          product: {
            select: { price: true },
          },
          date: true,
        },
        orderBy: { date: 'asc' },
      });

      return revenueData.reduce((acc, item) => {
        const obj = { price: item.product.price, date: item.date };
        acc.push(obj);
        return acc;
      }, []);
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async getProductCategories(dto: DateFilterDto) {
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
    try {
      const orders = await this.findMany({
        where: whereClause,
        select: {
          id: true,
        },
      });

      return await this.productService.getProductCategoryData(orders);
    } catch (error) {
      console.error(error.message);
      throw new BadRequestException('Something went wrong');
    }
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
        email: dto.email,
      });

      const product = await this.productService.createProduct({
        name: dto.product_name,
        category: dto.product_category,
        price: dto.price,
      });

      const order_date = AppUtilities.parseDate(dto.order_date);

      try {
        await prisma.order.upsert({
          where: {
            customerId_productId_date: {
              customerId: customer.id,
              productId: product.id,
              date: order_date,
            },
          },
          create: {
            customer: { connect: { id: customer.id } },
            product: { connect: { id: product.id } },
            ...(dto.order_date && {
              date: order_date,
            }),
            createdBy: customer.id,
          },
          update: {},
        });
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    });
  }

  async bulkUploadOrders({ orders }: BulkUploadOrdersDto) {
    return await this.prisma.$transaction(async () => {
      for (const order of orders) {
        await this.createOrder(order);
      }
    });
  }

  async getDateRange(period: Period) {
    const range = AppUtilities.generateDateRange(period);

    return {
      startDate: range[DateRangeMap[period]?.startDate],
      endDate: range[DateRangeMap[period]?.endDate],
      previousStart: range[DateRangeMap[period]?.previousStart],
      previousEnd: range[DateRangeMap[period]?.previousEnd],
    };
  }

  async validateBulkUploadOrder(bulkOrdersDto: BulkUploadOrdersDto) {
    const { invalidData, validData } =
      await this.validateBulkOrdersData(bulkOrdersDto);
    const validDto: BulkUploadOrdersDto = {
      orders: validData,
    };

    return {
      validRecordCount: validData.length,
      invalidRecordCount: invalidData.length,
      invalidRecords: invalidData,
      validRecords: validDto,
    };
  }

  private async validateBulkOrdersData(bulkOrdersDto: BulkUploadOrdersDto) {
    const validData = [];
    const invalidData = [];

    for (const order of bulkOrdersDto.orders) {
      if (!isNotEmpty(order.customer_name)) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.CUSTOMER_NAME_REASON].join(
              ', ',
            )
          : OrderUploadReasons.CUSTOMER_NAME_REASON;
      }
      if (
        !isNotEmpty(order.order_date) ||
        !moment(order.order_date, 'DD/MM/YYYY').isValid()
      ) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.ORDER_DATE_REASON].join(', ')
          : OrderUploadReasons.ORDER_DATE_REASON;
      }
      if (!isEnum(order.product_category, ProductCategory)) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.PRODUCT_CATEGORY_REASON].join(
              ', ',
            )
          : OrderUploadReasons.PRODUCT_CATEGORY_REASON;
      }
      if (order.email && !isEmail(order.email)) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.CUSTOMER_EMAIL_REASON].join(
              ', ',
            )
          : OrderUploadReasons.CUSTOMER_EMAIL_REASON;
      }
      if (!isNumber(order.price)) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.PRICE_REASON].join(', ')
          : OrderUploadReasons.PRICE_REASON;
      }
      if (!isNotEmpty(order.product_name)) {
        order['reason'] = order['reason']
          ? [order['reason'], OrderUploadReasons.PRODUCT_NAME_REASON].join(', ')
          : OrderUploadReasons.PRODUCT_NAME_REASON;
      }

      if (order['reason']) {
        invalidData.push(order);
      }

      if (!order['reason']) {
        validData.push(order);
      }
    }

    return { invalidData, validData };
  }
}
