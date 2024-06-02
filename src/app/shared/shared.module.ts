import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroGrupoEspacioFisicoComponent } from './components/filtro-grupo-espacio-fisico/filtro-grupo-espacio-fisico.component';
import { SharedService } from './service/shared.service';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ShowMessageService } from './service/show-message.service';
import { MessageService } from 'primeng/api';
import { VisualizadorExcelComponent } from './components/visualizador-excel/visualizador-excel.component';


@NgModule({
  declarations: [
    FiltroGrupoEspacioFisicoComponent,
    VisualizadorExcelComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    FiltroGrupoEspacioFisicoComponent
  ],
  providers: [
    SharedService,
    ShowMessageService,
    MessageService
  ]
})
export class SharedModule { }
