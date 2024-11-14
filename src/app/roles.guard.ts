import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './componentes/common/services/login.service';

@Injectable({
    providedIn: 'root'
})
export class RolesGuard implements CanActivate {

    constructor(private loginService: LoginService) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return false;
    }

    async obtenerRolDelUsuarioLogueado(correo: string) {
        return null
    }
  
}
