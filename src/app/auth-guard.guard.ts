import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './componentes/common/services/login.service';
import { TokenService } from './componentes/common/services/token.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

	constructor(private loginService: LoginService,
		private router: Router,
		private tokenService: TokenService) {}

	
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.tokenService.getToken()) {
			return true;
		} else {
			this.router.navigate(["/auth"])
			return false;
		}
	}
	
}
