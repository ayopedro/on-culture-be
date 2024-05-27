import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BulkUploadOrders } from './dto/bulk-upload-order.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  async getAllOrders() {
    return this.orderService.getOrders();
  }

  @Get('summary')
  async getSummary() {
    return this.orderService.getSummary();
  }

  @Post()
  @ApiResponseMeta({ message: 'Order created successfully' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Post('bulk-upload')
  async bulkUploadOrders(@Body() dto: BulkUploadOrders) {
    return this.orderService.bulkUploadOrders(dto);
  }
}
