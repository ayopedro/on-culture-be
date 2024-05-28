import { IsArray } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUploadOrdersDto {
  @IsArray()
  @ApiProperty()
  orders: CreateOrderDto[];
}
