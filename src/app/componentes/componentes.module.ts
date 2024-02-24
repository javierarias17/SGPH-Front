import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentesRoutingModule } from './componentes-routing.module';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar-curso.component';
import { GestionarAsignaturaComponent } from './datos/gestionar-asignatura/gestionar-asignatura.component';
import { GestionarAulaComponent } from './datos/gestionar-aula/gestionar-aula.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { InputDemoRoutingModule } from '../demo/components/uikit/input/inputdemo-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { ChipModule } from 'primeng/chip';
import { KnobModule } from 'primeng/knob';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PaginatorModule } from 'primeng/paginator';
import { PickListModule } from 'primeng/picklist';
import { GestionarDocenteComponent } from './datos/gestionar-docente/gestionar-docente.component';
import { CrearEditarVerCursoComponent } from './datos/gestionar-curso/crear-editar-consultar-curso/crear-editar-ver-curso.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { CrearPeriodoAcademicoComponent } from './periodo-academico/crear-periodo-academico/crear-periodo-academico.component';
import { GestionarGrupoComponent } from './datos/gestionar-grupo/gestionar-grupo.component';
import { CargarLaborDocenteComponent } from './datos/cargar-labor-docente/cargar-labor-docente.component';
import { PlanificacionManualComponent } from './planificacion-horario/planificacion-manual/planificacion-manual.component';
import { PlanificacionSemestreAnteriorComponent } from './planificacion-horario/planificacion-semestre-anterior/planificacion-semestre-anterior.component';
import { PlanificacionSemestreAutomaticaComponent } from './planificacion-horario/planificacion-semestre-automatica/planificacion-semestre-automatica.component';
import { GenerarReporteAulaComponent } from './reportes/generar-reporte-aula/generar-reporte-aula.component';
import { GenerarReporteDocenteComponent } from './reportes/generar-reporte-docente/generar-reporte-docente.component';
import { GenerarReporteSimcaComponent } from './reportes/generar-reporte-simca/generar-reporte-simca.component';
import { GestionarReservaTemporalComponent } from './reservas/gestionar-reserva-temporal/gestionar-reserva-temporal.component';
import { GestionarReservaFacultadComponent } from './reservas/gestionar-reserva-facultad/gestionar-reserva-facultad.component';
import { GestionarUsuarioComponent } from './seguridad/gestionar-usuario/gestionar-usuario.component';
import { AsociarAulaComponent } from './planificacion-horario/planificacion-manual/asociar-aula/asociar-aula.component';
import { AsociarDocenteComponent } from './planificacion-horario/planificacion-manual/asociar-docente/asociar-docente.component';
import { HorarioDocenteComponent } from './datos/gestionar-docente/horario-docente/horario-docente.component';
import { CrearEditarVerDocenteComponent } from './datos/gestionar-docente/crear-editar-ver-docente/crear-editar-ver-docente.component';
import { HorarioAulaComponent } from './datos/gestionar-aula/horario-aula/horario-aula.component';
import { CrearEditarVerUsuarioComponent } from './seguridad/gestionar-usuario/crear-editar-ver-usuario/crear-editar-ver-usuario.component';

@NgModule({
  declarations: [
    GestionarCursoComponent,
    GestionarAsignaturaComponent,
    GestionarDocenteComponent,
    GestionarAulaComponent,
    AsociarAulaComponent,
    AsociarDocenteComponent,
    CrearEditarVerCursoComponent,
    InicioComponent,
    CrearPeriodoAcademicoComponent,
    GestionarGrupoComponent,
    CargarLaborDocenteComponent,
    PlanificacionManualComponent,
    PlanificacionSemestreAnteriorComponent,
    PlanificacionSemestreAutomaticaComponent,
    GenerarReporteAulaComponent,
    GenerarReporteDocenteComponent,
    GenerarReporteSimcaComponent,
    GestionarReservaTemporalComponent,
    GestionarReservaFacultadComponent,
    GestionarUsuarioComponent,
    HorarioDocenteComponent,
    CrearEditarVerDocenteComponent,
    HorarioAulaComponent,
    CrearEditarVerUsuarioComponent
  ],
  imports: [
    PaginatorModule,
    ComponentesRoutingModule,    
    CommonModule,
    TableModule,
    ToastModule,
    DialogModule,			
    ButtonModule,
    PickListModule,    
		MultiSelectModule,
		CheckboxModule,
    ToolbarModule
  ]
})
export class ComponentesModule { }
