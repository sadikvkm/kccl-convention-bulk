import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';

@Injectable()
export class ResponseHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    return next
      .handle()
      .pipe(map(value => {

        let res = {};
        const message = value?.message;
        
        if(value?.message) delete value?.message;
        if(value?.status) delete value?.status;

        if([422, 400, 401].includes(value?.code)){
          response.status(value.code)
          delete value.code;
          res['status'] = false;
          res['errors'] = value.errors;
          res['message'] = message || 'Unprocessable Entity';
        }else {
          response.status(200)
          res['status'] = true;
          res['result'] = value ?? "";
          res['message'] = message || 'Action successfully completed.';
        }

        return res;

      }));
      
  }
}
