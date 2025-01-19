import { Component } from '@angular/core';
import { TokenService } from '../../common/services/token.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informacion-reserva-temporal',
  templateUrl: './informacion-reserva-temporal.component.html',
  styleUrls: ['./informacion-reserva-temporal.component.css']
})
export class InformacionReservaTemporalComponent {
  constructor(private tokenService: TokenService, private oauthService: OAuthService, private router: Router)
   {}

  ngOnInit(): void {
    // Puedes agregar lógica adicional en el futuro si es necesario
  }

  cerrarSesion() {
    // Limpiar token y datos de sesión
    this.tokenService.logOut(); // Borra los datos almacenados
    sessionStorage.clear(); // Limpia toda la sesión
    localStorage.clear(); // Opcional: limpia el almacenamiento local si se usa

    // Cerrar sesión de Google
    this.oauthService.logOut();

    // Redirigir al inicio de sesión
    this.router.navigate(['/auth/login']);
  }
}
