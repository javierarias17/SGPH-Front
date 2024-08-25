import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/componentes/servicios/login.service';
import { TokenService } from 'src/app/componentes/servicios/token.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    isLogged = false;
    isLoginFail = false;
    roles: string[] = [];

    valCheck: string[] = ['remember'];
    formulario: FormGroup

    constructor(public layoutService: LayoutService,
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
            clientId: '367828352403-9q6b2b1662fripg3q68q4bd7ugarlrpo.apps.googleusercontent.com',
            redirectUri: window.location.origin + '/auth/login',
            scope: 'openid profile email',
        }

        this.oauthService.configure(config);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
        this.oauthService.events.subscribe(e => {
        console.log(e)
        if (e.type === 'token_received') {
            this.loginGoogle();
        }})
    }

    async loginGoogle() {
       try{
            this.tokenService.setToken(this.oauthService.getAccessToken())
            const idToken = this.oauthService.getIdToken();
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            const email = payload.email;

            let tokenDto:any = await this.loginService.loginGoogle(this.oauthService.getAccessToken()).toPromise();
            
            if(tokenDto == null){
                console.error('Error durante el flujo de login', tokenDto);
                this.showMessageService.showMessage("error", "Usuario aun no registrado")
            }else{
                this.establercerInfoLocalStorage(tokenDto);
                this.router.navigate(['/'])
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión con Google:', error);
            this.showMessageService.showMessage("error", "Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
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
    nombreUsuario(): FormControl {
        return this.formulario.get("nombreUsuario") as FormControl
    }
    password(): FormControl {
        return this.formulario.get("password") as FormControl
    }
 
    public iniciarSesionNormal(){
        this.loginService.login(this.nombreUsuario().value, this.password().value).subscribe(
            data => {
                this.isLogged = true;   
                this.establercerInfoLocalStorage(data);           
                this.router.navigate(['/']);
            },
            err => {
                this.isLogged = false;
                this.showMessageService.showMessage("error", "Usuario aun no registrado")
            }
        );
    }

    private establercerInfoLocalStorage(data: any){
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.showMessageService.showMessage("error", "Bienvenido " + data.nombreUsuario);
    }
    
}
