import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [OrdersModule, PrismaModule, CustomersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
