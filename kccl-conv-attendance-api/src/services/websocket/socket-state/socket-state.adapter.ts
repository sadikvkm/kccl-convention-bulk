import { HttpException, INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import socketio from 'socket.io';


import { SocketStateService } from './socket-state.service';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter  {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
  ) {
    super(app);
  }

  public create(port: number, options: any): any {
    const server = super.createIOServer(port, options);
 
    server.use(async (socket: AuthenticatedSocket, next) => {
        let { access_from, access_token, auth } = socket.handshake.query;
        auth = "1212";

        if(auth) {
          socket.auth = {
            userId: auth.toString(),
          };
          return next();
        }
          
    });
    return server;
  }

  public bindClientConnect(server: socketio.Server, callback: Function): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      this.socketStateService.add(socket.auth.userId, socket);
      socket.on('disconnect', () => {
        this.socketStateService.remove(socket.auth.userId, socket);
        socket.removeAllListeners('disconnect');
      });
      callback(socket);
    });
  }
}
