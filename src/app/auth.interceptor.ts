import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from './componentes/common/services/token.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private tokenService: TokenService, private router: Router) { 
    }

  	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Clona la solicitud y añade el encabezado de autorización si el token está presente
		let authReq = req;
		const token = this.tokenService.getToken();
			if (token) {
				authReq = req.clone({
					setHeaders: {
					Authorization: `Bearer ${token}`
					}
				});
			}

		// Maneja la solicitud y captura cualquier error
		return next.handle(authReq).pipe(
			catchError((error: HttpErrorResponse) => {
				// Si el error es un 401, redirige al usuario a la página de login
				if (error.status === 401 && !this.esRutaPublica(req.url)) {
					this.tokenService.logOut();  // Limpia toda la información del local storage
					this.router.navigate(['/auth/login']);  
				}
			return throwError(() => error);
			})
		);
  	}

	private esRutaPublica(url: string): boolean {
		// Compara la URL completa con los segmentos que sabes están abiertos en backend
		// Devuelve true si coincide con cualquiera de esos "paths" públicos
		return (
		  url.includes('/Autenticacion/') ||
		  url.includes('/AdministrarHorario/') ||
		  url.includes('/AdministrarReservaTemporal/')
		);
	 }
	  
}
