import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Ecommerce CV example')
    .setDescription('The ecommerce CV API description')
    .setVersion('1.0')
    .addTag('CV')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}
bootstrap();
