import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BulkUploadOrders } from './dto/bulk-upload-order.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { JwtGuard } from '@@/common/guard/auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllOrders() {
    return this.orderService.getOrders();
  }

  @Get('summary')
  @UseGuards(JwtGuard)
  async getSummary() {
    return this.orderService.getSummary();
  }

  @Post()
  @ApiResponseMeta({ message: 'Order created successfully' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Post('bulk-upload')
  @UseGuards(JwtGuard)
  async bulkUploadOrders(@Body() dto: BulkUploadOrders) {
    return this.orderService.bulkUploadOrders(dto);
  }
}
