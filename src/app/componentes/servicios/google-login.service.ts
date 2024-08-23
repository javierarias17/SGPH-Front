
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { PersonaService } from './persona.service';
import { PersonaOutDTO } from '../dto/persona/persona.out.dto';
import { ShowMessageService } from 'src/app/shared/service/show-message.service';
import { UsuarioService } from './usuario.service';
import { UsuarioOutDTO } from '../dto/usuario/out/usuario.out.dto';

@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {
  usuario: UsuarioOutDTO
  constructor(
      private oauthService: OAuthService, 
      private router: Router, 
      private personaService:PersonaService, 
      private messageService: ShowMessageService,
      private usuarioService: UsuarioService
  ) {
    this.initLogin();
    
  }

  initLogin() {
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
        this.validarCorreoRegistro();
      }})
  }

  async login() {
    try {
      await this.oauthService.initLoginFlow();
    } catch (error) {
      console.error('Error durante el flujo de login', error);
    }
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['/auth/login'])
  }
  token() {
    return this.oauthService.getAccessToken()
  }

  getProfile(): any {
    return this.oauthService.getIdentityClaims();
  }
  async validarCorreoRegistro() {
    localStorage.setItem('token', this.oauthService.getAccessToken())
    const idToken = this.oauthService.getIdToken();
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const email = payload.email;
    let persona: PersonaOutDTO = await this.personaService.consultarPersonaPorEmail(email).toPromise()
    if (!persona) {
      this.invalido()
    } else {
      let usuario: UsuarioOutDTO = await this.usuarioService.consultarUsuarioActivoPorIdPersona(persona.idPersona).toPromise()
      if (!usuario.idUsuario) {
        this.invalido()
      } else {
        this.usuario = usuario
        this.router.navigate(['/home/inicio'])
      }
    }
  }
  invalido() {
    this.logout()
    this.messageService.showMessage("error", "Usuario aun no registrado")
    console.error('Correo electrónico no válido');
  }
  get usuarioLogueado(): UsuarioOutDTO {
    return this.usuario
  }
}
