import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BooksSystemErrorFilter } from './erorr-handling/books-system.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new BooksSystemErrorFilter())
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
