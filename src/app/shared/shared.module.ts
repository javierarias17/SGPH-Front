import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './service/shared.service';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ShowMessageService } from './service/show-message.service';
import { MessageService } from 'primeng/api';
import { VisualizadorExcelComponent } from './components/visualizador-excel/visualizador-excel.component';
import { SpinnerComponent } from './components/spinner/spinner.component';


@NgModule({
  declarations: [
    VisualizadorExcelComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
  ],
  exports: [
    SpinnerComponent
  ],
  providers: [
    SharedService,
    ShowMessageService,
    MessageService,
    
  ]
})
export class SharedModule { }
