import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { PeriodoAcademicoService } from '../shared/service/periodo.academico.service';
import { LoginService } from '../componentes/servicios/login.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { TokenService } from '../componentes/servicios/token.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
        .sidebar {
            background: rgb(12,128,178);
background: radial-gradient(circle, rgba(12,128,178,1) 45%, rgba(7,57,116,1) 84%);
        }`
    ]
})
export class AppTopBarComponent implements OnInit {

    username: string
    imgProfile: string
    public periodoAcademico :string = "";

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, 
        public periodoAcademicoService:PeriodoAcademicoService,
        private tokenService: TokenService,
        private router: Router,
        public loginService: LoginService,
        public oauthService: OAuthService
    ) { }


    ngOnInit() {
        this.imgProfile = null;
        this.username = this.tokenService.getUserName();

        let valor:any = this.oauthService.getIdentityClaims();
        if(valor){
            this.imgProfile = valor.picture.trim();
            this.loadImageWithRetry(this.imgProfile);
        }        

        this.periodoAcademicoService.subcribirDataPeriodoAcademico().subscribe(r =>{
            if(r){
                this.periodoAcademico = r.anio+"-"+r.periodo;
            }else{
                this.periodoAcademico=null;
            }

        });
    }
    cerrarSesion() {
        this.oauthService.logOut();
        this.tokenService.logOut();
        this.router.navigate(['/auth/login']);
    }


    loadImageWithRetry(url: string) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            console.log('Imagen cargada correctamente');
        };
        img.onerror = () => {
            console.log('Falló la carga de la imagen, reintentando en 2 segundos...');
            setTimeout(() => {
                this.imgProfile = url; // Reasigna la URL para forzar la recarga
            }, 2000); // Reintenta cargar la imagen después de 2 segundos
        };
    }
}
