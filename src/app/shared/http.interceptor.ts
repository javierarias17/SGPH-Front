import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoginService } from '../componentes/servicios/login.service';

@Injectable()
export class HttpInterceptores implements HttpInterceptor {

  constructor( private loginService: LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //this.spinnerInterceptorService.mostrar();
    if (this.loginService.getToken()) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.loginService.getToken()}`
        }
      });
      return next.handle(authReq).pipe(
        finalize( () => {
          //aa
        })
      );
    }
    return next.handle(request).pipe(
      finalize( () => {
        //aa
      })
    );
  }
}
