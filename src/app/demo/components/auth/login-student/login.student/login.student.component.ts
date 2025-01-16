import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { LoginService } from 'src/app/componentes/common/services/login.service';
import { TokenService } from 'src/app/componentes/common/services/token.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
  selector: 'app-login.student',
  templateUrl: './login.student.component.html',
  styleUrls: ['./login.student.component.css']
})
export class LoginStudentComponent {
    isLogged = false;

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private router: Router,
    private oauthService: OAuthService,
    private showMessageService: ShowMessageService
  ) {
    this.initLogin();
  }

  private initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '209217537458-cmls25384a06iif0mca643mpqrebig26.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/login-student',
      scope: 'openid profile email',
    };

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe((e) => {
      if (e.type === 'token_received') {
        this.loginGoogle();
      }
    });
  }

  async loginGoogle() {
    try {
        console.log("ESTUDIANTE");
      const idToken = this.oauthService.getIdToken();
      const tokenDto: any = await this.loginService
        .loginGoogle(this.oauthService.getAccessToken())
        .toPromise();

      if (tokenDto) {
        this.tokenService.setToken(tokenDto.token);
        this.tokenService.setAuthorities(tokenDto.authorities);
        this.redirigirPorRol();
      } else {
        this.showMessageService.showMessage('error', 'Usuario no registrado');
      }
    } catch (error) {
      this.oauthService.logOut();
      this.showMessageService.showMessage('error', 'Error en la autenticación');
    }
  }

  private redirigirPorRol() {
    if (this.tokenService.isStudent()) {
      this.router.navigate(['/student-dashboard']);
    } else {
      this.router.navigate(['/']);
      this.showMessageService.showMessage('error', 'Rol no autorizado');
    }
  }
}
