import { Component, OnInit } from '@angular/core';
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
export class LoginStudentComponent implements OnInit{
  isLoggedEstudent = false;

  constructor(
    private oauthService: OAuthService,
    private loginService: LoginService,
    private tokenService: TokenService,
    private showMessageService: ShowMessageService,
    private router: Router
  ) {
    this.initLogin();
  }

  private initLogin() {
    // Verifica si es un estudiante desde el sessionStorage o alguna variable lógica
    this.isLoggedEstudent = sessionStorage.getItem('isLoggedEstudent') === 'true';

    // Define la URL de redirección según el tipo de usuario
    const redirectUri = this.isLoggedEstudent
        ? window.location.origin + '/login-student/ReservaTemporal'
        : window.location.origin + '/auth/login';

    // Configuración de OAuth
    const config: AuthConfig = {
        issuer: 'https://accounts.google.com',
        strictDiscoveryDocumentValidation: false,
        clientId: '209217537458-cmls25384a06iif0mca643mpqrebig26.apps.googleusercontent.com',
        redirectUri,
        scope: 'openid profile email',
    };

    // Configura OAuth
    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();

    // Carga la configuración del proveedor y valida el inicio de sesión
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        // Aquí podemos manejar redirecciones iniciales según el estado del token
        if (this.isLoggedEstudent) {
            console.log('Redirigiendo al login de estudiante');
            this.router.navigate(['/login-student/ReservaTemporal']);
        }
    });

    // Suscríbete a eventos de OAuth
    this.oauthService.events.subscribe((e) => {
        if (e.type === 'token_received') {
            console.log('Token recibido');
            if (this.isLoggedEstudent) {
                this.loginGoogleEstudent(); // Manejo específico para estudiantes
            } else {
                this.loginGoogleEstudent(); // Manejo específico para administrativos
            }
        }
    });
}


  async loginGoogleEstudent() {
    try {
        // Obtener el token de Google
        const idToken = this.oauthService.getIdToken();
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const email = payload.email;
        const alias = email.split('@')[0];

        let tokenDto:any = await this.loginService.loginGoogle(this.oauthService.getAccessToken()).toPromise();
        console.log("TOKEN ISLOGGEDESTUDEN", tokenDto.nombreUsuario);
        console.log("SLIASSSSS", alias);
        this.isLoggedEstudent = await this.loginService.esEstudianteActivo(alias).toPromise();
        console.log("ISLOGGEDESTUDEN", this.isLoggedEstudent);
        if(tokenDto == null){
            console.error('Error durante el flujo de login', tokenDto);
            this.showMessageService.showMessage("error", "Usuario no registrado")
        }else{
            if(this.isLoggedEstudent){  
                this.establercerInfoLocalStorage(tokenDto);     
                this.router.navigate(['/login-student/ReservaTemporal']); // Redirigir
                           
            }
            else{
                this.oauthService.logOut();
                this.showMessageService.showMessage(
                    'error',
                    'Usuario INACTIVO.'
                );
            }

        // Extraer el email del token (payload)
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const email = payload.email;

        console.log('Usuario autenticado con Google:', email);

        // Aquí podrías guardar el correo en el almacenamiento si lo necesitas
        sessionStorage.setItem('emailEstudiante', email);

        // Redirigir al formulario de estudiantes
        this.router.navigate(['/login-student/ReservaTemporal']);
    } 
    } catch (error) {
        this.oauthService.logOut();
        console.error('Error al intentar iniciar sesión con Google:', error);
        this.showMessageService.showMessage("error", "Usuario no registrado")
    }
  }

  async iniciarSesionGoogleEstudent() {
    this.isLoggedEstudent = true;
    sessionStorage.setItem('isLoggedEstudent', 'true'); // Guarda el estado
    try {
      await this.oauthService.initLoginFlow();
    } catch (error) {
      console.error('Error durante el flujo de login:', error);
      this.showMessageService.showMessage('error', 'Hubo un problema al iniciar sesión con Google.');
    }
  }

  ngOnInit(): void {
    if (this.isLoggedEstudent) {
      this.router.navigate(['/login-student/ReservaTemporal']);
    }
  }

  private establercerInfoLocalStorage(data: any){
    this.tokenService.setToken(data.token);
    this.tokenService.setUserName(data.nombreUsuario);
    this.tokenService.setAuthorities(data.authorities);
    console.log("USUARIO DATA", data)
    // Almacenar idPersona y otros datos del usuario en el localStorage
    const usuarioData = {
        idPersona: data.idPersona, // Ajusta según la estructura de tu API
        nombreUsuario: data.nombreUsuario,
        roles: data.authorities,
    };
    localStorage.setItem('usuarioData', JSON.stringify(usuarioData));
    console.log("USUARIO DATA", usuarioData)
   //his.roles = data.authorities;
    this.showMessageService.showMessage("error", "Bienvenido " + data.nombreUsuario);
}
}
