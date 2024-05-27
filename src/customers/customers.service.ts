import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PrismaService } from '@@/common/database/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(dto: CreateCustomerDto) {
    let customer: Customer;
    try {
      const existingCustomer = await this.prisma.customer.findFirst({
        where: { email: dto.email },
      });
      if (existingCustomer) {
        customer = await this.prisma.customer.create({ data: dto });
      } else {
        customer = existingCustomer;
      }

      return customer;
    } catch (error) {
      throw new InternalServerErrorException('Customer could not be created');
    }
  }

  async getCustomers() {
    return await this.prisma.customer.findMany();
  }

  async getCustomersCount() {
    return await this.prisma.customer.count();
  }

  async getCustomer(id: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id } });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async getCustomerOrders(id: string) {
    const customer = await this.prisma.customer.findFirst({
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
