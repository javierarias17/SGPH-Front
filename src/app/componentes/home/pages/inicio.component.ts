import { Component } from '@angular/core';
import { TokenService } from '../../common/services/token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  public autorities: string[] = [];

  constructor(private tokenService:TokenService) { }

  ngOnInit(): void {
    this.autorities = this.tokenService.getAuthorities();
  }

}
