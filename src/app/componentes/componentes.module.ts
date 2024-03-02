import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentesRoutingModule } from './componentes-routing.module';
import { GestionarCursoComponent } from './datos/gestionar-curso/gestionar-curso.component';
import { GestionarAsignaturaComponent } from './datos/gestionar-asignatura/gestionar-asignatura.component';
import { GestionarAulaComponent } from './datos/gestionar-aula/gestionar-aula.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
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
import { TranslateModule } from '@ngx-translate/core';

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
    ToolbarModule,
	TranslateModule
  ]
})
export class ComponentesModule { }
