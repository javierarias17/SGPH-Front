import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaPrincipalAsignaturaComponent } from './pages/bandeja-principal-asignatura/bandeja-principal-asignatura.component';
import { CrearEditarAsignaturaComponent } from './componentes/crear-editar-asignatura/crear-editar-asignatura.component';
import { DetalleCargaAsignaturasComponent } from './dialog/detalle-carga-asignaturas/detalle-carga-asignaturas.component';
import { GestionarAsignaturaRoutingModule } from './gestionar-asignatura-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { FacultadService } from '../../common/services/facultad.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgramaService } from '../../common/services/programa.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'primeng/message';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { ToastModule } from 'primeng/toast';
import { AsignaturaService } from '../../common/services/asignatura.service';
import { FileUploadModule } from 'primeng/fileupload';


@NgModule({
  declarations: [
    BandejaPrincipalAsignaturaComponent,
    CrearEditarAsignaturaComponent,
    DetalleCargaAsignaturasComponent
  ],
  imports: [
    CommonModule,
    GestionarAsignaturaRoutingModule,
    InputNumberModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    SharedModule,
    MessageModule,
    ToastModule,
    FileUploadModule,
    PrimeNgModule,
  ],
  providers: [DialogService, FacultadService, ProgramaService, AsignaturaService]
})
export class GestionarAsignaturaModule { }
