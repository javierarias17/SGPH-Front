import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './componentes/servicios/token.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private tokenService: TokenService) { 
    }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.tokenService.getToken()) { 
        const token = 'tu-token-bearer-aqui'; 
        const authReq = req.clone({
            setHeaders: {
            Authorization: `Bearer ${this.tokenService.getToken()}`
            }
        });
        return next.handle(authReq);
    }
    return next.handle(req);
  }
}
