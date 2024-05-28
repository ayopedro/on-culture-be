import {
  IBulkUploadOrders,
  JOBS,
  OrderQueue,
} from '@@/common/interfaces/queue';
import { InjectQueue } from '@nestjs/bull';
import { Queue, JobOptions } from 'bull';

export class OrderQueueProducer {
  constructor(@InjectQueue(OrderQueue) private orderQueue: Queue) {}

  async queueBulkOrders(data: IBulkUploadOrders) {
    await this.addToQueue(JOBS.BulkUploadOrders, data, {
      removeOnComplete: true,
    });
  }

  private async addToQueue(jobName: JOBS, data: any, opts?: JobOptions) {
    return this.orderQueue.add(jobName, data, opts);
  }
}
