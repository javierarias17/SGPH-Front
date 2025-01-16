import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "./componentes/common/services/token.service";

@Injectable({
    providedIn: 'root'
})
export class StudentAuthGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {}

    canActivate(): boolean {
      if (this.tokenService.isStudent()) {
        return true;
      }
      this.router.navigate(['/auth']);
      return false;
    }
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class AdminAuthGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.tokenService.isAdmin()) {
        return true;
      }
      this.router.navigate(['/auth']);
      return false;
    }
  }