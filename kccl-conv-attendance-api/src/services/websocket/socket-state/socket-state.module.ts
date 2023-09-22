import { Module } from '@nestjs/common'
import { SocketStateService } from './socket-state.service'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  providers: [SocketStateService],
  exports: [SocketStateService],
  imports: [],
})
export class SocketStateModule {}
