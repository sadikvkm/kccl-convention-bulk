import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SocketStateAdapter } from './socket-state/socket-state.adapter';
import { SocketStateService } from './socket-state/socket-state.service';

export const initWebSocketAdapters = (app: INestApplication): INestApplication => {

  const socketStateService = app.get(SocketStateService);
  app.useWebSocketAdapter(new SocketStateAdapter(app, socketStateService));

  return app;
};