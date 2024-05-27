import { IsArray } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUploadOrders {
  @IsArray()
  @ApiProperty()
  orders: CreateOrderDto[];
}
