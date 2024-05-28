import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './app.config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    CustomersModule,
    OrdersModule,
    PrismaModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
