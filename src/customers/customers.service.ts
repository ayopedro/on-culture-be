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

  async getCustomersCount() {
    return await this.count({});
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
