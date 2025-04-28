import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes (new ValidationPipe({
    transform: true, // Enable class-transformer
    transformOptions: { enableImplicitConversion: true }, // Convert strings to numbers/booleans
  }),
);
 // app.use(new LoggerMiddleware().use);
 // app.use(new RateLimiterMiddleware().use);
//  app.enableCors();
app.enableCors({
  origin: 'http://localhost:3001', // Allow frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true, // If using cookies or auth headers
});
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] });
//   await app.listen(3000);
// }
// bootstrap();