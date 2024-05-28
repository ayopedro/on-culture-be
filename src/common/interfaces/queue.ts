import { BulkUploadOrdersDto } from '@@/orders/dto/bulk-upload-order.dto';

export const OrderQueue = 'on-culture:order:';

export enum JOBS {
  BulkUploadOrders = 'bulkUploadOrders',
}

export interface IBulkUploadOrders {
  orders: BulkUploadOrdersDto;
}
