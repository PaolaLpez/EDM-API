import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { LogsService } from './common/services/logs.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  
  // Pipe para validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // 🔥 AGREGADO: obtener LogsService sin romper estructura
  const logsService = app.get(LogsService);

  // 🔥 AGREGADO: filtro global con logs
  app.useGlobalFilters(new AllExceptionFilter(logsService));

  // Swagger config (SIN CAMBIOS)
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidad de seguridad')
    .setDescription('Documentación de la api para pruebas')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Servidor de pruebas')
    .addServer('https:dominio.com', 'servidor productivo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


//?POSTGRES
//! npm i pg
//! npm i @types/pg

//?MYSQL
//! npm i mysql2
//! npm i @types/mysql

//! git commit -a -m "fix: Uso de providers (pg, mysql) para conexión a base de datos"

//! npm i @nestjs/swagger

//! git commit -a -m "fix: Correcion del CRUD y uso del swagger"

//! git commit -a -m "fix: Uso de Prisma y corrección de crud"

// npx prisma generate  
//npx prisma migrate dev --name init

// git commit -a -m "fix: Uso de custom errors, correccion de sesion en CRUD tareas"

//elegir un framework adecuado angular material, react cmd3, tailwind css
//Utilizar guias de diseño para UX, IX, estandarizar
//Revisar estructura de codigo, logica, bien segmentado, utilizar template,
//de forma abstracta y de calidad

// git commit -a -m "bug: Corrección de auth y creación de rutas (refresh,logout) "