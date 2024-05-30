import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserModule } from '@angular/platform-browser';
import { GestionarPeriodoAcademicoRoutingModule } from './gestionar-periodo-academico-routing.module';
import { CrearEditarPeriodoAcademicoComponent } from './components/crear-editar-periodo-academico/crear-editar-periodo-academico.component';
import { BandejaPrincipalPeriodoAcademicoComponent } from './pages/bandeja-principal-periodo-academico/bandeja-principal-periodo-academico.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CrearEditarPeriodoAcademicoComponent,
    BandejaPrincipalPeriodoAcademicoComponent
  ],
  imports: [
    CommonModule,
    GestionarPeriodoAcademicoRoutingModule,
    CommonModule,
    PrimeNgModule,
    SharedModule,
    InputNumberModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    CalendarModule,
    ConfirmDialogModule,
    BrowserModule,
    ReactiveFormsModule,
  ]
})
export class GestionarPeriodoAcademicoModule { }
