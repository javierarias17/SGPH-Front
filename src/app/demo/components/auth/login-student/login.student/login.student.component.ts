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
    isLoginFail = false;
    roles: string[] = [];

    valCheck: string[] = ['remember'];
    formulario: FormGroup

  constructor(
    private fb: FormBuilder,
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
      }

      this.oauthService.configure(config);
      this.oauthService.setupAutomaticSilentRefresh();
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.events.subscribe(e => {
          console.log(e);
          if (e.type === 'token_received') {
              this.loginGoogle();
          }
      });
  }

  async loginGoogle() {
      try {
          const idToken = this.oauthService.getIdToken();
          const payload = JSON.parse(atob(idToken.split('.')[1]));
          const email = payload.email;

          const tokenDto: any = await this.loginService.loginGoogle(this.oauthService.getAccessToken()).toPromise();
          
          if (tokenDto == null) {
              console.error('Error durante el flujo de login', tokenDto);
              this.showMessageService.showMessage("error", "Usuario no registrado");
          } else {
              this.establercerInfoLocalStorage(tokenDto);
              this.redirigirPorRol();
          }
      } catch (error) {
          this.oauthService.logOut();
          console.error('Error al intentar iniciar sesión con Google:', error);
          this.showMessageService.showMessage("error", "Usuario no registrado");
      }
  }

  async iniciarSesionGoogle() {
      try {
          await this.oauthService.initLoginFlow();
      } catch (error) {
          console.error('Error durante el flujo de login', error);
      }
  }

  ngOnInit(): void {
          this.inicializarFormulario()
          if (this.tokenService.getToken()) {
              this.isLogged = true;
              this.isLoginFail = false;
              this.roles = this.tokenService.getAuthorities();
          }
      }
      inicializarFormulario() {
          this.formulario = this.fb.group({
              nombreUsuario: ["", Validators.required],
              password: [null, Validators.required]
          })
      }

  private establercerInfoLocalStorage(data: any){
      this.tokenService.setToken(data.token);
      this.tokenService.setUserName(data.nombreUsuario);
      this.tokenService.setAuthorities(data.authorities);
      this.showMessageService.showMessage("success", "Bienvenido " + data.nombreUsuario);
  }

  private redirigirPorRol() {
      const roles = this.tokenService.getAuthorities();
      if (roles.includes('ROLE_STUDENT')) {
          this.router.navigate(['/autho/ReservaTemporal']);
      } else if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin-dashboard']); // Asegúrate de tener esta ruta y componente
      } else {
          this.router.navigate(['/']);
      }
  }
}
