import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/componentes/common/services/login.service';
import { ReservaTemporalService } from 'src/app/componentes/common/services/reserva.temporal.service';
import { TokenService } from 'src/app/componentes/common/services/token.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

    isLogged = false;
    isLoginFail = false;
    roles: string[] = [];
    currentTab: string = 'admin';
    valCheck: string[] = ['remember'];
    formulario: FormGroup
    isLoggedEstudent = false;
    isLoggedAdmin = false;
    constructor(public layoutService: LayoutService,
        private fb: FormBuilder,
        private loginService: LoginService,
        private tokenService: TokenService,
        private router: Router,
        private oauthService: OAuthService,
        private showMessageService: ShowMessageService,
        private reservaTemporalService: ReservaTemporalService
    ) { 
        this.initLogin();
    }

    private initLogin() {
        this.isLoggedEstudent = sessionStorage.getItem('isLoggedEstudent') === 'true'; // Recupera el estado
        console.log('Iniciando configuración de login, isLoggedEstudent:', this.isLoggedEstudent);
        const redirectUri = window.location.origin + '/auth/login';
    
        const config: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            clientId: '209217537458-cmls25384a06iif0mca643mpqrebig26.apps.googleusercontent.com',
            redirectUri: redirectUri, 
            scope: 'openid profile email',
        };
    
        this.oauthService.configure(config);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    
        this.oauthService.events.subscribe((e) => {
            if (e.type === 'token_received') {
                console.log('TOKEN RECIBIDO, REDIRIGIENDO:', this.isLoggedEstudent);
                if (this.isLoggedEstudent) {
                    this.loginGoogleEstudent(); // Para estudiantes
                } else {
                    this.loginGoogle(); // Para administrativos
                }
            }
        });
    }    
    
    async loginGoogle() {
       try{
            
            const idToken = this.oauthService.getIdToken();
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            const email = payload.email;
            const alias = email.split('@')[0];
            let tokenDto:any = await this.loginService.loginGoogle(this.oauthService.getAccessToken()).toPromise();
            console.log("TOKENDTO", tokenDto);
            this.isLoggedAdmin = await this.loginService.esAdministradorActivo(tokenDto.estadoUsuario).toPromise();
            console.log("TOKENDTOESTADOUSUARIO", this.isLoggedAdmin);
            if(tokenDto == null){
                console.error('Error durante el flujo de login', tokenDto);
                this.showMessageService.showMessage("error", "Usuario no registrado")
            }else{
                const roles = this.tokenService.getAuthorities();
                if (this.isLoggedAdmin) {   
                    this.establercerInfoLocalStorage(tokenDto);                 
                    // Si no es estudiante, redirigir a una página por defecto
                    this.router.navigate(['/']);
                }else{
                    this.oauthService.logOut();
                    this.showMessageService.showMessage(
                        'error',
                        'Error el usuario no se encuentra ACTIVO.'
                    );
                }
            }
        } catch (error) {
            this.oauthService.logOut();
            console.error('Error al intentar iniciar sesión con Google:', error);
            this.showMessageService.showMessage("error", "Usuario no registrado")
        }
    }

    async iniciarSesionGoogle() {
        try {
            await this.oauthService.initLoginFlow();
        } catch (error) {
            console.error('Error durante el flujo de login', error);
        }
    }

    async iniciarSesionGoogleEstudent() {
        console.log('Iniciando sesión como estudiante');
        this.isLoggedEstudent = true;
        sessionStorage.setItem('isLoggedEstudent', 'true'); // Guarda el estado
        console.log('isLoggedEstudent al iniciar sesión:', this.isLoggedEstudent);
        try {
            await this.oauthService.initLoginFlow();
        } catch (error) {
            console.error('Error durante el flujo de login', error);
            this.showMessageService.showMessage(
                'error',
                'Hubo un problema al iniciar sesión con Google.'
            );
        }
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
    
    private obtenerAliasGoogle(): string {
        const idToken = this.oauthService.getIdToken();
        if (!idToken) {
            throw new Error('No se pudo obtener el ID Token de Google');
        }
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        return payload.email.split('@')[0];
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
    nombreUsuario(): FormControl {
        return this.formulario.get("nombreUsuario") as FormControl        
    }
    password(): FormControl {
        return this.formulario.get("password") as FormControl
    }
 
    public iniciarSesionNormal() {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }
    
        this.loginService.login(this.nombreUsuario().value, this.password().value).subscribe(
            async (data) => {
                console.log("Datos de respuesta del login:", data);
                this.isLogged = true;
                this.establercerInfoLocalStorage(data);
                this.router.navigate(['/']);
            },
            err => {
                this.isLogged = false;
                this.showMessageService.showMessage("error", err.message);
            }
        );
    }
    
    private establercerInfoLocalStorage(data: any){
        console.log("📢 Datos recibidos en login:", data);
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        console.log("✅ Guardando datos en localStorage:", data);
        const usuarioData = {
            idPersona: data.idPersona, // Ajusta según la estructura de tu API
            nombreUsuario: data.nombreUsuario,
            roles: data.authorities,
        };
        const esEstudiante = sessionStorage.getItem('isLoggedEstudent') === 'true';
    if (esEstudiante) {
        sessionStorage.setItem('usuarioDataEstudiante', JSON.stringify(usuarioData));
    } else {
        sessionStorage.removeItem('usuarioDataEstudiante');
        localStorage.setItem('usuarioDataAdministrativo', JSON.stringify(usuarioData));
      }

    console.log("USUARIO GUARDADO:", esEstudiante ? "Estudiante en sessionStorage" : "Administrativo en localStorage");
    }

    selectTab(tab: string) {
        this.currentTab = tab; // Cambia entre Administrativos y Estudiantes
    }
    
    logout() {
        this.isLogged = false;
        this.isLoggedEstudent = false;
        sessionStorage.removeItem('isLoggedEstudent');
        this.oauthService.logOut();
        console.log("RESERVA TEMPORAL", this.router.url.includes('/login-student/ReservaTemporal'));
        if (this.router.url.includes('/login-student/ReservaTemporal')) {
            this.router.navigate(['/login-student']);
        } else {
            this.router.navigate(['/']);
        }
    }
    
}
