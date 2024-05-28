import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CustomersService } from '@@/customers/customers.service';
import { ProductsService } from '@@/products/products.service';
import { BullModule } from '@nestjs/bull';
import { OrderQueue } from '@@/common/interfaces/queue';
import { OrderQueueProducer } from './queue/producer';
import { OrderQueueConsumer } from './queue/consumer';

@Module({
  imports: [BullModule.registerQueue({ name: OrderQueue })],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CustomersService,
    ProductsService,
    OrderQueueProducer,
    OrderQueueConsumer,
  ],
})
export class OrdersModule {}
