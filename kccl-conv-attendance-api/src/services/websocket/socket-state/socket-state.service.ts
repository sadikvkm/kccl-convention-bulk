import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class SocketStateService {
  private socketState = new Map<string, Socket[]>();

  constructor() {}

  public remove(userId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter(s => s.id !== socket.id);

    if (!sockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, sockets);
    }

    return true;
  }

  public add(userId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId) || [];
  
    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public get(userId: string): Socket[] {
    // console.log("this.socketState", this.socketState ,this.socketState.keys(),userId);
    
    return this.socketState.get( userId) || [];
  }

  public getAll(): Socket[] {
    const all = [];
    this.socketState.forEach(sockets => all.push(sockets));

    return all;
  }

  public getSocket() {
    return this.socketState;
  }

  public async sendToAllConnection(key, data = {}) {

    const all = [];
    this.socketState.forEach(sockets => all.push(sockets));
    setTimeout(() => {
      const all = [];
      this.socketState.forEach(sockets => all.push(sockets));

      for (let i = 0; i < all.length; i++) {
        const socket = all[i];
        socket[0].emit(key, data)
      }
    });
  }

  public async sendToAll(type: string, data: any = "") {

    const socket = await this.get("1212");
    console.log(socket.length)
    socket.forEach(i => {
      i.emit(type, data)
    });
    // if(socket.length !== 0)
    //   socket[0].emit(type, data);
  }

  public async sendTo(type: string, id: string, data: any = "") {
    const socket = await this.get(id.toString());
    if(socket.length !== 0)
      socket[0].emit(type, data);
  }
}
