import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  ADMINISTRADOR: number = 1
  usuarioLogueado$ = new Subject<any>();
  constructor(private http: HttpClient, private router: Router) { }

  getLogin(correo: string, password: string) {
    let credenciales = {
      correo: correo,
      password: password
    }
    return this.http.post<HttpResponse<any>>(environment.url.concat("login"), credenciales, {
      observe: 'response'
    }).pipe(
      map( (response : HttpResponse<any>) => {
        const body = response.body
        const headers = response.headers;
        const bearerToken = headers.get('Authorization')
        const token = bearerToken?.replace("Bearer ", '');
        localStorage.setItem("correo", credenciales.correo)
        localStorage.setItem("token", token!);
        return body;
      })
    );
  }

  getToken() {
    return localStorage.getItem("token");
  }
  getCorreo() {
    return localStorage.getItem("correo");
  }
  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/auth'])
  }
  getDetalleUsuarioLogueadoAsObserver() : Observable<any> {
    return this.usuarioLogueado$.asObservable()
  }
}
