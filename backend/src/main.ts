// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Voeg CORS toe:
  app.enableCors({
    origin: 'http://localhost:5173', // De URL van je Vue dev server
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();