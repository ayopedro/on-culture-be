import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BulkUploadOrders } from './dto/bulk-upload-order.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { JwtGuard } from '@@/common/guard/auth.guard';
import { GetOrdersFilterDto } from './dto/get-orders.dto';
import { DateFilterDto } from './dto/date-filter.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getAllOrders(@Query() query: GetOrdersFilterDto) {
    return this.orderService.getOrders(query);
  }

  @Get('summary')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getSummary(@Query() query: DateFilterDto) {
    return this.orderService.getSummary(query);
  }

  @Post()
  @ApiResponseMeta({ message: 'Order created successfully' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Post('bulk-upload')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async bulkUploadOrders(@Body() dto: BulkUploadOrders) {
    return this.orderService.bulkUploadOrders(dto);
  }
}
