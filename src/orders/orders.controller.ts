import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { BulkUploadOrdersDto } from './dto/bulk-upload-order.dto';
import { ApiResponseMeta } from '@@/common/decorators/response.decorator';
import { JwtGuard } from '@@/common/guard/auth.guard';
import { GetOrdersFilterDto } from './dto/get-orders.dto';
import { DateFilterDto } from './dto/date-filter.dto';
import { OrderQueueProducer } from './queue/producer';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private orderService: OrdersService,
    private orderQueueProducer: OrderQueueProducer,
  ) {}

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

  @Get('revenue')
  async getRevenueBreakdown(@Query() query: DateFilterDto) {
    return this.orderService.getRevenueBreakdown(query);
  }

  @Post('bulk-upload')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async bulkUploadOrders(@Body() dto: BulkUploadOrdersDto) {
    return this.orderQueueProducer.queueBulkOrders({ orders: dto });
  }

  @ApiResponseMeta({ message: 'Request successful!', statusCode: 200 })
  @Post('/validate-bulk-upload')
  async bulkUploadValidation(@Body() bulkUploadDto: BulkUploadOrdersDto) {
    return this.orderService.validateBulkUploadOrder(bulkUploadDto);
  }
}
