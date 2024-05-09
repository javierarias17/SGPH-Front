import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroGrupoEspacioFisicoComponent } from './components/filtro-grupo-espacio-fisico/filtro-grupo-espacio-fisico.component';
import { SharedService } from './service/shared.service';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    FiltroGrupoEspacioFisicoComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    FiltroGrupoEspacioFisicoComponent
  ],
  providers: [
    SharedService
  ]
})
export class SharedModule { }
