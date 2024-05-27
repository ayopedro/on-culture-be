import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CustomersService } from '@@/customers/customers.service';
import { ProductsService } from '@@/products/products.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, CustomersService, ProductsService],
})
export class OrdersModule {}
