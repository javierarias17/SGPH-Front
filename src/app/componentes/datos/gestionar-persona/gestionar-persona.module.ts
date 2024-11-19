import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CrearEditarPersonaComponent } from './components/crear-editar-consultar-eliminar-persona/crear.editar.consultar.eliminar.persona';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SharedModule } from 'primeng/api';
import { BandejaPrincipalPersonaComponent } from './pages/bandeja-principal-persona/bandeja-principal-persona.component';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { GestionarPersonaRoutingModule } from './gestionar-persona-routing.module';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    BandejaPrincipalPersonaComponent,
    CrearEditarPersonaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    DynamicDialogModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    PrimeNgModule,
    GestionarPersonaRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MessageModule,
    ToastModule,
  ],
  providers: [
    DialogService,
    MessageService,
  ],
})
export class GestionarPersonaModule {}
