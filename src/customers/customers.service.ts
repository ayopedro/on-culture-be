import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaService } from '@@/common/database/prisma/prisma.service';
import { CustomerMaptype } from './customer.maptype';
import { CrudService } from '@@/common/database/crud.service';
import { AppUtilities } from '@@/common/utilities';
import { PreviousDataDate } from '@@/common/interfaces';

@Injectable()
export class CustomersService extends CrudService<
  Prisma.CustomerDelegate,
  CustomerMaptype
> {
  constructor(private prisma: PrismaService) {
    super(prisma.customer);
  }

  async createCustomer({ email, name }: CreateCustomerDto) {
    let customer;
    try {
      const existingCustomer = await this.findFirst({
        where: { email: { equals: email.toLowerCase() } },
      });

      if (!existingCustomer) {
        customer = await this.create({
          data: {
            name,
            email: email.toLowerCase(),
          },
        });
      } else {
        customer = existingCustomer;
      }
    } catch (error) {
      throw new InternalServerErrorException('Customer could not be created');
    }
    return customer;
  }

  async getCustomers() {
    return await this.findManyPaginate({});
  }

  async getCustomersCount(
    duration: Record<any, any>,
    previousData?: PreviousDataDate,
  ) {
    const current = await this.count({
      where: {
        orders: {
          some: {
            AND: [
              { date: { gte: duration?.startDate } },
              { date: { lte: duration?.endDate } },
            ],
          },
        },
      },
    });

    let previous = 0;

    if (previousData?.startDate)
      previous = await this.count({
        where: {
          orders: {
            some: {
              AND: [
                { date: { gte: previousData?.startDate } },
                { date: { lte: previousData?.endDate } },
              ],
            },
          },
        },
      });

    const difference = AppUtilities.calculatePeriodDiff(current, previous);

    return {
      current,
      difference,
    };
  }

  async getCustomer(id: string) {
    const customer = await this.findFirst({ where: { id } });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async getCustomerOrders(id: string) {
    const customer = await this.findFirst({
      where: { id },
      include: { orders: true },
    });

    if (!customer) {
      throw new NotFoundException(
        "Cannot get customer's orders. Customer not found",
      );
    }

    return customer;
  }
}
