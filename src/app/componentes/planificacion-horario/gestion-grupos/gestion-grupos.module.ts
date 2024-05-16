import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandejaGruposComponent } from './pages/bandeja-grupos/bandeja-grupos.component';
import { CrearEditarGrupoComponent } from './components/crear-editar-grupo/crear-editar-grupo.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GrupoService } from './services/grupo.service';
import { GestionGruposRoutingModule } from './gestion-grupos-routing.module';
import { FacultadServicio } from '../../servicios/facultad.servicio';
import { ReactiveFormsModule } from '@angular/forms';
import { AsignarEspacioFisicoComponent } from './components/asignar-espacio-fisico/asignar-espacio-fisico.component';



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
  providers: [ GrupoService, FacultadServicio ]
})
export class GestionGruposModule { }
