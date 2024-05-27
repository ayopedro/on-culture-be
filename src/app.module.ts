import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    OrdersModule,
    PrismaModule,
    CustomersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
