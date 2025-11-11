import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app/app.module';
import { CONFIG } from '@/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(CONFIG.CORS);
  app.setGlobalPrefix('api/v1');
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(CONFIG.PORT).then(() => {
    Logger.log(`Running on port: ${CONFIG.PORT}`, NestApplication.name);
  });
}

void bootstrap();
