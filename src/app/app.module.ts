import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { ComponentesModule } from './componentes/componentes.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { PeriodoAcademicoService } from './shared/service/periodo.academico.service';
import { LenguajeService } from './componentes/servicios/lenguaje.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SpinnerService } from './shared/service/spinner.service';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './auth.interceptor';

// Se importa registerLocaleData y los datos de localización en español
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Registramos los datos de localización para español
registerLocaleData(localeEs);

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        OAuthModule.forRoot(),
        AppRoutingModule,
        AppLayoutModule,
        ComponentesModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }),
        SharedModule
    ],
    providers: [
        // Proveemos LOCALE_ID con el valor 'es' para establecer el idioma español
        { provide: LOCALE_ID, useValue: 'es' },
        SpinnerService,
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, LenguajeService, ConfirmationService, PeriodoAcademicoService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    /*Se inyecta para configurar el archivo de internacionalización*/
    constructor(private languageService: LenguajeService, private primengConfig: PrimeNGConfig) {

        // Se configura en español el calendario de los formularios
        this.primengConfig.setTranslation({
            dayNames: [
              "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
            ],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: [
              "enero", "febrero", "marzo", "abril", "mayo", "junio",
              "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ],
            monthNamesShort: [
              "ene", "feb", "mar", "abr", "may", "jun",
              "jul", "ago", "sep", "oct", "nov", "dic"
            ],
            today: "Hoy",
            clear: "Limpiar",
            dateFormat: "dd/mm/yy",
            weekHeader: "Sem",
            firstDayOfWeek: 1,
          });
    }
 }
