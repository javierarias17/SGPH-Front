import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
import { LenguajeServicio } from './componentes/servicios/lenguaje.servicio';
import { ConfirmationService } from 'primeng/api';
import { PeriodoAcademicoService } from './shared/service/periodo.academico.service';
import { HttpInterceptores } from './shared/http.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ComponentesModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptores, multi: true },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, LenguajeServicio, ConfirmationService, PeriodoAcademicoService 
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    /*Se inyecta para configurar el archivo de internacionalización*/
    constructor(private languageService: LenguajeServicio) {
    }
 }
