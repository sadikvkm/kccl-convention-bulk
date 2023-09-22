import { Global, Module } from '@nestjs/common';
import { SocketStateModule } from './socket-state/socket-state.module';
import { WebSocketEventsGateway } from './websocket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
 
@Global()
@Module({
   providers: [WebSocketEventsGateway],
  imports: [SocketStateModule],
  exports: [SocketStateModule],
})
export class WebSocketModule {}
