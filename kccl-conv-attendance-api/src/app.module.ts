import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { DataBaseKnex } from './db';
import { ConventionAttendance } from './attendance/entities/attendance.entity';
import { DataBaseModule } from './database.module';
import { WebSocketModule } from './services/websocket/websocket.module';

@Module({
  imports: [
    AttendanceModule,
    ConventionAttendance,
    DataBaseModule,
    DataBaseKnex,
    WebSocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
