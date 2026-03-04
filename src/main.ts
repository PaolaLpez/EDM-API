import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // elimina propiedades no permitidas
      forbidNonWhitelisted: true,   // lanza error si envían propiedades extra
      transform: true,              // transforma automáticamente DTOs
    }),
  );

  // 📚 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentación de la API para pruebas')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Servidor local')
    .addServer('https://dominio.com', 'Servidor de producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ruta donde estará la documentación
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Servidor corriendo en: http://localhost:${port}`);
  console.log(`Documentación en: http://localhost:${port}/api/docs`);
}

bootstrap();