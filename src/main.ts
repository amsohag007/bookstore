import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './core/handlers/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // we can use this line to globally enable
  // for all controllers
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/techniques/versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // swagger api documentation setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BookStore Api Documentation')
    .setDescription('The core api of BookStore')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3333, '0.0.0.0');

  console.log(
    '\x1b[35m',
    `🚀 Application is running on: ${await app.getUrl()}`,
  );
  console.log(
    `🚀 Api documentions available at: http://localhost:${process.env.PORT}/api/docs`,
  );
}
bootstrap();
