import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFilter } from './response/validation.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Configura el límite de tamaño de carga usando opciones integradas
  // app.use(bodyParser.json({ limit: '10mb' }));
  // app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  // Remove line below to enable local ValidationPipe settings
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationFilter());
  if(process.env.NODE_ENV === 'production'){
    await app.listen(process.env.PORT);
  } else {
    await app.listen(3000);
  }
}
bootstrap();
