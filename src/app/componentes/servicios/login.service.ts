import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

	urlAutenticacion:string = 'Autenticacion';

	constructor(private http: HttpClient) { }

	public login(nombreUsuario: string, password: string): Observable<any> {
		const url = `${environment.url}${this.urlAutenticacion}/login`;
		let loginUsuario = {nombreUsuario: nombreUsuario,password: password}
        return this.http.post<any>(url, loginUsuario);  
	}

	public loginGoogle(tokenGoogle: string) {
		const url = `${environment.url}${this.urlAutenticacion}/loginGoogle`;
		let tokenDto = {value: tokenGoogle}
        return this.http.post<any>(url, tokenDto);  
	}
}
