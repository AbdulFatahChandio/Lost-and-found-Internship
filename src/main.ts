import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import InjectSwagger from './core/injector/swagger.injector';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors();

  // GLOBAL PREFIX + API VERSIONING ENABLED
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });


  // INJECT SWAGGER CONFIGURATIONS
  InjectSwagger(app);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}

bootstrap();
