import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true 
}));

//Configuración de swagger
const config = new DocumentBuilder()
.setTitle('|API con vulnerabilidades de seguridad')
.setDescription('Documentación de la API para pruebas')
.setVersion('1.0.0')
.addServer("https:dominio.com", "Servidor de pruebas")
.addServer("https://localhost:3000", "Servidor de producción")
.build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
