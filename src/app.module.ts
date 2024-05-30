import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './common/database/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './app.config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    AuthModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        prefix: `${config.get('environment')}.${config.get('app.name')}`,
        url: config.get('redis.url'),
        redis: config.get('redis'),
        defaultJobOptions: { removeOnComplete: true },
      }),
    }),
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
