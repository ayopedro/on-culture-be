import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorsInterceptor } from './common/interceptors/error.interceptor';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('app.port');

  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new ResponseInterceptor(),
    new ErrorsInterceptor(),
  );

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[] = []) =>
        new BadRequestException(
          errors.reduce(
            (errObj, validationList) => ({
              ...errObj,
              [validationList.property]: validationList.constraints,
            }),
            {},
          ),
        ),
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('On-Culture App')
    .setDescription('The On-Culture API to manage the app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*',
  });

  await app.listen(port);
}

bootstrap();
