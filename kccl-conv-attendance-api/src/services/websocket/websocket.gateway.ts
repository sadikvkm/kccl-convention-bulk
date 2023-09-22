import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SocketStateService } from './socket-state/socket-state.service';

@WebSocketGateway({ cors: true })
export class WebSocketEventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        public socketService: SocketStateService,
    ) { }
    @WebSocketServer()
    public server: Server;
    private logger: Logger = new Logger('AppGateway');
    
    afterInit(server: Server) {

    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
        this.updateUserOnlineState(client, true);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.updateUserOnlineState(client, false);
    }

    async updateUserOnlineState(socket, online = false) {
        const { auth } = socket.handshake.query;
        // await this.UserModel.updateOne({_id : new Types.ObjectId(auth)}, {
        //     isOnline: online,
        // })
        await this.socketService.sendToAllConnection('notify-user-online', { id: auth, isOnline: online });
    }
}

