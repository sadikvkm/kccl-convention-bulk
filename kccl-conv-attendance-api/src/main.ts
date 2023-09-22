import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initWebSocketAdapters } from './services/websocket/websocket.adapters.init';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableCors();

  initWebSocketAdapters(app);
 
  await app.listen(3011);
}
bootstrap();
