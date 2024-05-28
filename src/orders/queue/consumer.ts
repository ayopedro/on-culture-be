import {
  IBulkUploadOrders,
  JOBS,
  OrderQueue,
} from '@@/common/interfaces/queue';
import { QueueProcessor } from '@@/common/interfaces/queue.processor';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { Job } from 'bull';

@Processor(OrderQueue)
export class OrderQueueConsumer extends QueueProcessor {
  protected logger: Logger;

  constructor(private orderService: OrdersService) {
    super();
    this.logger = new Logger('OrderConsumer');
  }

  @Process({ name: JOBS.BulkUploadOrders })
  async processBulkInsMembers({ data }: Job<IBulkUploadOrders>) {
    this.orderService.bulkUploadOrders(data.orders);
  }
}
