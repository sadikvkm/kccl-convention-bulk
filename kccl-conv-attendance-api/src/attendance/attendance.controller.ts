import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ResponseHandlerInterceptor } from 'src/response/response-handler.interceptor';
import { SocketStateService } from 'src/services/websocket/socket-state/socket-state.service';

@Controller('attendance')
export class AttendanceController {
  constructor(
    @InjectModel() private readonly knex: Knex,
    public socketService: SocketStateService,
  ) {}

  @Get('/gate/display')
  @UseInterceptors(ResponseHandlerInterceptor)
  async getGateDisplay(@Query() query) {

    let d = []

    const gateSet = query.gate.split(',')
    for (let i = 0; i < gateSet.length; i++) {
      const element = gateSet[i];
      const data = await this.knex.from('convention_attendance')
      .where('gate', +element)
      .orderBy('convention_attendance.created_at', 'desc')
      .join('users', 'convention_attendance.userId', '=', 'users.id')
      .join('association_details', 'users.id', '=', 'association_details.userId')
      .join('district_master', 'association_details.districtId', '=', 'district_master.id')
      .join('mekhala_master', 'association_details.mekhalaId', '=', 'mekhala_master.id')
      .select('users.id', 'users.name', 'district_master.name as district', 'mekhala_master.name as mekhala', 'users.userImage')
      .first();

      d.push({
        gateCount: await this.getReportedCount(element),
        gate: +element,
        data: {
          ...data,
          image: data?.userImage ? getUserImageTemp(data?.userImage) : ''
        }
      })
    }

    return {
      completed: d,
      count: ""
    }
  }

  @Get('/reported/count')
  @UseInterceptors(ResponseHandlerInterceptor)
  async getReportedCountFun(@Query() query) {

    return await this.getReportedCount(query.gate)
  }

  async getReportedCount(gateSet) {

    const total = await this.knex.from('convention_attendance').count();
    const attended = await this.knex.from('convention_attendance').where('gate', gateSet).count();

    return {
      total: total[0]['count(*)'],
      attended: attended[0]['count(*)']
    }
  }

  @Post('/report')
  @UseInterceptors(ResponseHandlerInterceptor)
  async markAttendance(@Body() body) {
    if(body.registerNo) {

      const checkRegister = await this.knex.from('convention_registration')
      .where('convention_registration.registerNo', body.registerNo)
      .join('users', 'convention_registration.userId', '=', 'users.id')
      .join('association_details', 'users.id', '=', 'association_details.userId')
      .join('district_master', 'association_details.districtId', '=', 'district_master.id')
      .join('mekhala_master', 'association_details.mekhalaId', '=', 'mekhala_master.id')
      .select('users.id', 'users.name', 'district_master.name as district', 'mekhala_master.name as mekhala', 'users.userImage')
      .first();


      console.log(checkRegister)



      if(!checkRegister) {
        return {
          code: 422,
          errors: {
            registerNo: ['The register number is invalid.']
          }
        }
      }


      const dataSet = {
        ...checkRegister,
        image: getUserImageTemp(checkRegister.userImage)
      }

      const checkAttendance = await this.knex.from('convention_attendance')
      .where('userId', checkRegister.id)
      .first();

      if(!checkAttendance) {
          await this.knex.from('convention_attendance')
        .insert({
          userId: checkRegister.id,
          gate: body.gate
        });

      }

      this.socketService.sendToAll('new-attendance-received', {
        gate: +body.gate,
        data: dataSet,
        gateCount: await this.getReportedCount(+body.gate)
      })

      return dataSet


    }
  }


}


function getUserImageTemp(userImage) {

  return process.env.MASTER_SERVER_URL + '/uploads/' + userImage
}