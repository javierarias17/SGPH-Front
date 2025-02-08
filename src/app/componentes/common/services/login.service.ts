import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

	urlAutenticacion:string = 'Autenticacion';

	constructor(private http: HttpClient) { }

	public login(nombreUsuario: string, password: string): Observable<any> {
		const url = `${environment.url}${this.urlAutenticacion}/login`;
		let loginUsuario = { nombreUsuario, password };
	
		return this.http.post<any>(url, loginUsuario).pipe(
			map(response => {
				// Si no hay token, verificamos el estadoUsuario
				if (!response.token) {
					if (response.estadoUsuario === "INACTIVO") {
						throw new Error("El usuario está inactivo. No puede iniciar sesión.");
					}
					if (response.estadoUsuario === "ERROR") {
						throw new Error("Nombre de usuario o contraseña erróneos.");
					}
				}
				return response;
			}),
			catchError(error => throwError(() => error))
		);
	}	
	
	public loginGoogle(tokenGoogle: string) {
		const url = `${environment.url}${this.urlAutenticacion}/loginGoogle`;
		let tokenDto = {value: tokenGoogle}
        return this.http.post<any>(url, tokenDto);  
	}

	/**
   * Verifica si un estudiante es activo
   * @param username Nombre de usuario
   * @returns Observable<boolean>
   */
	public esEstudianteActivo(nombreUsuario: string): Observable<boolean> {
		const url = `${environment.url}${this.urlAutenticacion}/esEstudianteActivo?usuarioEst=${nombreUsuario}`;
		return this.http.get<boolean>(url);
	}
	
	/**
	   * Verifica si un administrador es activo
	   * @param username Nombre de usuario
	   * @returns Observable<boolean>
    */
    public esAdministradorActivo(estado: string): Observable<boolean> {
		const url = `${environment.url}${this.urlAutenticacion}/esAdministradorActivo?estado=${estado}`;
    	return this.http.get<boolean>(url);
    }
}
