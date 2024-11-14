import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaGruposComponent } from './pages/bandeja-grupos/bandeja-grupos.component';
import { CrearEditarGrupoComponent } from './components/crear-editar-grupo/crear-editar-grupo.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GestionGruposRoutingModule } from './gestion-grupos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AsignarEspacioFisicoComponent } from './components/asignar-espacio-fisico/asignar-espacio-fisico.component';
import { FacultadService } from '../../common/services/facultad.service';
import { AgrupadorService } from './services/agrupador.service';



@NgModule({
  declarations: [
    BandejaGruposComponent,
    CrearEditarGrupoComponent,
    AsignarEspacioFisicoComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SharedModule,
    GestionGruposRoutingModule,
    ReactiveFormsModule
  ],
  providers: [ AgrupadorService, FacultadService ]
})
export class GestionGruposModule { }
